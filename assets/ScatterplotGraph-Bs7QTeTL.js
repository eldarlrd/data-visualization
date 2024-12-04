import{c as h,s as l,d as c,h as f,b as x,a as S}from"./index-BG6vf5fz.js";import{u as T,l as k}from"./useApi-CBYkAbkT.js";import{b as O,a as b,c as y}from"./band-CI1WAP09.js";import{m as L}from"./max-DBeXZoyG.js";import{m as R}from"./min-D1slsF82.js";const $=[{color:c.COLORS.darkRed,label:"Doping"},{color:c.COLORS.darkBlue,label:"No Doping"}],v=()=>{const r=l("#graph").append("g").attr("transform","translate(540, 20)");$.forEach((e,o)=>{const n=r.append("g").attr("transform",`translate(0, ${(o*20).toString()})`);n.append("rect").attr("width",15).attr("height",15).attr("fill",e.color),n.append("text").attr("x",22).attr("y",14).text(e.label)})},p=a=>{const[r,e]=a.split(":").map(Number);return r+e/60},A=a=>{const r=~~a,e=Math.round((a-r)*60);return`${String(r).padStart(2,"0")}:${String(e).padStart(2,"0")}`},C=(a,r)=>{const o=r.Doping?"red":"blue",n=+l(a.target).attr("width"),s=a.clientY+n;S({e:a,posY:s,width:12.5,fillColor:o}),l("#tooltip").html(`
      ${c.FLAGS[r.Nationality]}
      <strong>
        ${r.Name}
      </strong>
      <br>
        ${r.Time} | ${r.Year.toString()}
      <br>
      <span class='text-danger'>
        ${r.Doping??""}
      </span>
    `)},Y=a=>{const r=l("#graph").append("g").attr("transform","translate(40, 20)");r.append("text").attr("id","title").attr("x",-240).attr("y",20).attr("transform","rotate(-90)").text("Time in Minutes");const e=a.map(t=>t.Year);e.sort((t,i)=>t-i);const o=O().domain(e.map(t=>t.toString())).range([0,600]).paddingOuter(.625).paddingInner(1),n=L(a,t=>t.Time?p(t.Time):0)??0,s=R(a,t=>t.Time?p(t.Time):0)??0,m=k().domain([n,s]).range([350,0]),d=Array.from({length:Math.ceil((n-s)*60/15)+1},(t,i)=>s+i*15/60),g=b(o),u=y(m).tickValues(d).tickFormat(A);r.append("g").attr("transform","translate(0, 350)").call(g),r.append("g").call(u),r.selectAll("circle").data(a).enter().append("circle").attr("r",6).attr("cx",t=>o(t.Year.toString())??0).attr("cy",t=>m(p(t.Time))).style("cursor",t=>t.URL?"pointer":"auto").style("fill",t=>t.Doping?c.COLORS.darkRed:c.COLORS.darkBlue).on("mouseover",C).on("mouseout",(t,i)=>{f(t,i.Doping?"darkRed":"darkBlue")}).on("click",x),v()},N=()=>(T("doping").then(a=>{Y(a)}).catch(a=>{a instanceof Error&&console.error(a)}),h(1,"graph"));export{N as ScatterplotGraph};
