import React, { useState, useEffect, useRef } from "react";
import {
  Scene,
  Color,
  PerspectiveCamera,
  LoadingManager,
  TextureLoader,
  WebGLRenderer,
  SphereGeometry,
  MeshStandardMaterial,
  PointLight,
  ShaderMaterial,
  Mesh,
  Vector3,
  BackSide,
  AdditiveBlending,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import DatePicker from "react-datepicker";
import axios from "axios";
import "../styles/viewer.css";
import "react-datepicker/dist/react-datepicker.css";
import meridianLogo from "../assets/meridian.svg";

import 'react-vis/dist/style.css';
import { XYPlot, LineSeries, XAxis, YAxis, FlexibleWidthXYPlot, VerticalGridLines, HorizontalGridLines } from 'react-vis';
import LineGraph from "../components/LineGraph";

export const View = () => {
  // const [day, setDay] = useState(1);
  // const [month, setMonth] = useState(1);
  // const [year, setYear] = useState(2020);
  const [date, setDate] = useState(new Date(2020, 0, 1));
  const [rotate, setRotate] = useState(true);

  const DateButton = ({ value, onClick }) => (
    <button className="cal-button" onClick={onClick}>
      {value}
    </button>
  );

  const [stats, setStats] = useState({});

  const canvasRef = useRef(null);

  const vsScript = //Rendering script for outer glow vertex shader
    "uniform vec3 viewVector;" +
    "uniform float c;" +
    "uniform float p;" +
    "varying float intensity; " +
    "void main() {" +
    "vec3 vNormal = normalize(normalMatrix * normal); vec3 vNormel = normalize(normalMatrix * viewVector); intensity = pow(c - dot(vNormal,vNormel), p);" +
    "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);" +
    "}";

  const fsScript = //Rendering script for outer glow fragment shader
    "uniform vec3 glowColor;" +
    "varying float intensity;" +
    "void main() {" +
    "vec3 glow = glowColor * intensity; gl_FragColor = vec4(glow, 1.0);" +
    "}";

  const loadManager = new LoadingManager();
  const loader = new TextureLoader(loadManager);

  let scene;
  let camera;
  let renderer;
  let controls;
  let geometry;

  let earthMaterial;
  let earth;

  let heatmapMaterial;
  let heatmap;

  let light;
  let glowMaterial;
  let outerGlow;

  let controlsRef = useRef()
  let heatmapRef = useRef()

  const loadHeatmap = (mapURI) => {
    heatmapRef.current.map = loader.load(mapURI);
  };

  const data = [
    { x: 0, y: 8 },
    { x: 1, y: 5 },
    { x: 2, y: 4 },
    { x: 3, y: 9 },
    { x: 4, y: 1 },
    { x: 5, y: 7 },
    { x: 6, y: 6 },
    { x: 7, y: 3 },
    { x: 8, y: 2 },
    { x: 9, y: 0 }
  ];

  const init = () => {
    //Initializes Scene, Camera, and Controls
    scene = new Scene();
    scene.background = new Color(0x94bdff);

    camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.z = 10;
    camera.position.y = 5;

    renderer = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.dampingFactor = 0.5;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.enableKeys = false;
    controls.minDistance = 6;
    controls.maxDistance = 14;
    controlsRef.current = controls
  };

  const buildGlobe = () => {
    geometry = new SphereGeometry(5, 80, 80);
    earthMaterial = new MeshStandardMaterial({
      bumpMap: loader.load("https://viewmeridian.com/api/data/bump"),
      bumpScale: 0.15,
    });
    earthMaterial.map = loader.load("https://viewmeridian.com/api/data/map");
    earth = new Mesh(geometry, earthMaterial);
    earth.position.x = 0;
    earth.position.y = 0;
    earth.position.z = 0;
    scene.add(earth);
  };

  const buildHeatmap = () => {
    heatmapMaterial = earthMaterial.clone();
    heatmapMaterial.transparent = true;
    heatmapRef.current = heatmapMaterial;

    heatmap = new Mesh(geometry, heatmapMaterial);
    heatmap.position.x = 0;
    heatmap.position.y = 0;
    heatmap.position.z = 0;
    scene.add(heatmap);

    light = new PointLight(0xffffff, 1);
    light.position.set(-5, 5, 20);
    scene.add(camera);
    camera.add(light);
  };

  const aura = () => {
    glowMaterial = new ShaderMaterial({
      uniforms: {
        c: {
          type: "f",
          value: 0.3,
        },
        p: {
          type: "f",
          value: 2,
        },
        glowColor: {
          type: "c",
          value: new Color(0xffffff),
        },
        viewVector: {
          type: "v3",
          value: camera.position,
        },
      },
      vertexShader: vsScript,
      fragmentShader: fsScript,
      side: BackSide,
      blending: AdditiveBlending,
      transparent: true,
    });

    outerGlow = new Mesh(geometry.clone(), glowMaterial.clone());
    outerGlow.position.x = 0;
    outerGlow.position.y = 0;
    outerGlow.position.z = 0;
    outerGlow.scale.multiplyScalar(1.2);
    scene.add(outerGlow);
  };

  const animate = () => {
    requestAnimationFrame(animate);

    controls.update();

    outerGlow.material.uniforms.viewVector.value = new Vector3().subVectors(
      camera.position,
      outerGlow.position
    );

    renderer.render(scene, camera);
  };

  const handleResize = () => {
    let canvas = canvasRef.current;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  };

  const [points, setPoints] = useState([]);

  useEffect(() => {
    init();
    buildGlobe();
    buildHeatmap();
    aura();

    controls.update();
    animate();

    controls.autoRotate = true;

    axios.get(`https://viewmeridian.com/api/data/stats/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`)
      .then((res) => {
        setStats(res.data);
      });

    window.addEventListener("resize", handleResize);

    // document.querySelector("#rotate").addEventListener("click", toggleRotation)
  }, []);

  useEffect(() => {
    loadHeatmap(`https://viewmeridian.com/api/data/heatmap/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`)
    axios.get(`https://viewmeridian.com/api/data/stats/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`)
      .then((res) => {
        setStats(res.data);
        console.log(res.data);
      });

  }, [date]);

  useEffect(() => {
    controlsRef.current.autoRotate = rotate
  }, [rotate]);


  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      <div className="controls">
        <label htmlFor="rotate">Auto Rotate:</label>
        <input
          type="checkbox"
          name="rotate"
          id="rotate"
          checked={rotate}
          onChange={() => setRotate(!rotate)}
        />
      </div>
      <div className="left-ctr">
        <div className="info-ctr">
          <div className="logo-ctr">
            <img src={meridianLogo} alt="Meridian Logo" />
          </div>
          <div className="info">
            <h1>Optimum Interpolation Sea Surface Temperatures</h1>
            <div className="date-select">
              <div className="select">
                <label htmlFor="date">Date</label>
                <DatePicker
                  selected={date}
                  id="date_picker"
                  onChange={(date) => setDate(date)}
                  minDate={new Date(2020, 0, 1)}
                  maxDate={new Date(2020, 0, 31)}
                  customInput={<DateButton />}
                />
              </div>
              <div className="playback"></div>
            </div>
            <label htmlFor="">Data</label>
            <h2>Max Temp: </h2>
            <p>{stats.max}°C</p>
            <br />
            <h2>Min Temp: </h2>
            <p>{stats.min}°C</p>
            <br />
            <h2>Mean SST: </h2>
            <p>{stats.avg}°C</p>
            <br />
            <h2>Std Dev: </h2>
            <p>{stats.std}°C</p>
          </div>
        </div>
      </div>
      <div className="full-stats">

      </div>
      <div className="card">
        <h2>See expanded dataset &gt;</h2>
        <FlexibleWidthXYPlot height={120} className="graph" style={{fontSize:"40px"}}>
          <XAxis />
          <YAxis />
          <VerticalGridLines />
          <HorizontalGridLines />
          <LineGraph data={data} className="line-series" />
        </FlexibleWidthXYPlot>
      </div>
    </div>
  );
};
