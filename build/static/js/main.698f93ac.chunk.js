(this.webpackJsonpmeridian_data=this.webpackJsonpmeridian_data||[]).push([[0],{355:function(e,t,n){},564:function(e,t,n){"use strict";n.r(t);var a=n(18),i=n(11),c=n.n(i),o=n(125),s=n.n(o),r=n(331),d=n(29),l=n(134),j=n(16),m=n(314),p=n(329),b=n.n(p),u=n(221),h=n.n(u),v=(n(355),n(356),n.p+"static/media/meridian.2ad4cede.svg"),w=(n(357),n(562),n(333),function(){var e,t,n,c,o,s,r,d,p,u,w,x,O=Object(i.useState)(new Date(2020,0,1)),g=Object(l.a)(O,2),f=g[0],y=g[1],S=Object(i.useState)(!0),N=Object(l.a)(S,2),D=N[0],M=N[1],C=function(e){var t=e.value,n=e.onClick;return Object(a.jsx)("button",{className:"cal-button",onClick:n,children:t})},k=Object(i.useState)({}),z=Object(l.a)(k,2),F=z[0],E=z[1],R=Object(i.useRef)(null),V=new j.e,_=new j.q(V),H=Object(i.useRef)(),T=Object(i.useRef)(),W=function a(){requestAnimationFrame(a),c.update(),x.material.uniforms.viewVector.value=(new j.s).subVectors(t.position,x.position),n.render(e,t)},A=function(){var e=R.current,a=window.innerWidth,i=window.innerHeight;e.width=a,e.height=i,t.aspect=window.innerWidth/window.innerHeight,t.updateProjectionMatrix(),n.setSize(a,i)},I=Object(i.useState)([]),P=Object(l.a)(I,2);P[0],P[1];return Object(i.useEffect)((function(){(e=new j.l).background=new j.c(9747967),(t=new j.i(75,window.innerWidth/window.innerHeight,.1,1e3)).position.z=10,t.position.y=5,(n=new j.t({canvas:R.current,antialias:!0})).setSize(window.innerWidth,window.innerHeight),document.body.appendChild(n.domElement),(c=new m.a(t,n.domElement)).dampingFactor=.5,c.enablePan=!1,c.enableDamping=!0,c.enableKeys=!1,c.minDistance=6,c.maxDistance=14,H.current=c,o=new j.n(5,80,80),(s=new j.h({bumpMap:_.load("https://viewmeridian.com/api/data/bump"),bumpScale:.15})).map=_.load("https://viewmeridian.com/api/data/map"),(r=new j.g(o,s)).position.x=0,r.position.y=0,r.position.z=0,e.add(r),(d=s.clone()).transparent=!0,T.current=d,(p=new j.g(o,d)).position.x=0,p.position.y=0,p.position.z=0,e.add(p),(u=new j.j(16777215,1)).position.set(-5,5,20),e.add(t),t.add(u),w=new j.m({uniforms:{c:{type:"f",value:.3},p:{type:"f",value:2},glowColor:{type:"c",value:new j.c(16777215)},viewVector:{type:"v3",value:t.position}},vertexShader:"uniform vec3 viewVector;uniform float c;uniform float p;varying float intensity; void main() {vec3 vNormal = normalize(normalMatrix * normal); vec3 vNormel = normalize(normalMatrix * viewVector); intensity = pow(c - dot(vNormal,vNormel), p);gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);}",fragmentShader:"uniform vec3 glowColor;varying float intensity;void main() {vec3 glow = glowColor * intensity; gl_FragColor = vec4(glow, 1.0);}",side:j.b,blending:j.a,transparent:!0}),(x=new j.g(o.clone(),w.clone())).position.x=0,x.position.y=0,x.position.z=0,x.scale.multiplyScalar(1.2),e.add(x),c.update(),W(),c.autoRotate=!0,h.a.get("https://viewmeridian.com/api/data/stats/".concat(f.getFullYear(),"/").concat(f.getMonth()+1,"/").concat(f.getDate())).then((function(e){E(e.data)})),window.addEventListener("resize",A)}),[]),Object(i.useEffect)((function(){var e;e="https://viewmeridian.com/api/data/heatmap/".concat(f.getFullYear(),"/").concat(f.getMonth()+1,"/").concat(f.getDate()),T.current.map=_.load(e),h.a.get("https://viewmeridian.com/api/data/stats/".concat(f.getFullYear(),"/").concat(f.getMonth()+1,"/").concat(f.getDate())).then((function(e){E(e.data),console.log(e.data)}))}),[f]),Object(i.useEffect)((function(){H.current.autoRotate=D}),[D]),Object(a.jsxs)("div",{children:[Object(a.jsx)("canvas",{ref:R}),Object(a.jsxs)("div",{className:"controls",children:[Object(a.jsx)("label",{htmlFor:"rotate",children:"Auto Rotate:"}),Object(a.jsx)("input",{type:"checkbox",name:"rotate",id:"rotate",checked:D,onChange:function(){return M(!D)}})]}),Object(a.jsx)("div",{className:"left-ctr",children:Object(a.jsxs)("div",{className:"info-ctr",children:[Object(a.jsx)("div",{className:"logo-ctr",children:Object(a.jsx)("img",{src:v,alt:"Meridian Logo"})}),Object(a.jsxs)("div",{className:"info",children:[Object(a.jsx)("h1",{children:"Optimum Interpolation Sea Surface Temperatures"}),Object(a.jsxs)("div",{className:"date-select",children:[Object(a.jsxs)("div",{className:"select",children:[Object(a.jsx)("label",{htmlFor:"date",children:"Date"}),Object(a.jsx)(b.a,{selected:f,id:"date_picker",onChange:function(e){return y(e)},minDate:new Date(2020,0,1),maxDate:new Date(2020,3,31),customInput:Object(a.jsx)(C,{})})]}),Object(a.jsx)("div",{className:"playback"})]}),Object(a.jsx)("label",{htmlFor:"",children:"Data"}),Object(a.jsx)("h2",{children:"Max Temp: "}),Object(a.jsxs)("p",{children:[F.max,"\xb0C"]}),Object(a.jsx)("br",{}),Object(a.jsx)("h2",{children:"Min Temp: "}),Object(a.jsxs)("p",{children:[F.min,"\xb0C"]}),Object(a.jsx)("br",{}),Object(a.jsx)("h2",{children:"Mean SST: "}),Object(a.jsxs)("p",{children:[F.avg,"\xb0C"]}),Object(a.jsx)("br",{}),Object(a.jsx)("h2",{children:"Std Dev: "}),Object(a.jsxs)("p",{children:[F.std,"\xb0C"]})]})]})}),Object(a.jsx)("div",{className:"full-stats"}),Object(a.jsx)("div",{className:"card",children:Object(a.jsx)("h2",{children:"See expanded dataset >"})})]})});var x=function(){return Object(a.jsx)("div",{className:"App",children:Object(a.jsx)(r.a,{children:Object(a.jsxs)(d.d,{children:[Object(a.jsx)(d.b,{path:"/view",component:w}),Object(a.jsx)(d.a,{to:"/view"})]})})})};s.a.render(Object(a.jsx)(c.a.StrictMode,{children:Object(a.jsx)(x,{})}),document.getElementById("root"))}},[[564,1,2]]]);
//# sourceMappingURL=main.698f93ac.chunk.js.map