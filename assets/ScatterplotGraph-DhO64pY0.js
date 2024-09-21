import{c as f,s as c,d as l,h,b as x,a as S}from"./index-CgN-64y7.js";import{u as T}from"./useApi-Cyi6M-ZX.js";import{b as k,m as O,l as b,a as y,c as L}from"./linear-DZPji4Eb.js";function R(t,a){let r;if(a===void 0)for(const n of t)n!=null&&(r>n||r===void 0&&n>=n)&&(r=n);else{let n=-1;for(let o of t)(o=a(o,++n,t))!=null&&(r>o||r===void 0&&o>=o)&&(r=o)}return r}const $=[{color:l.COLORS.darkRed,label:"Doping"},{color:l.COLORS.darkBlue,label:"No Doping"}],A=()=>{const a=c("#graph").append("g").attr("transform","translate(540, 20)");$.forEach((r,n)=>{const o=a.append("g").attr("transform",`translate(0, ${(n*20).toString()})`);o.append("rect").attr("width",15).attr("height",15).attr("fill",r.color),o.append("text").attr("x",22).attr("y",14).text(r.label)})},d=t=>{const[a,r]=t.split(":").map(Number);return a+r/60},C=t=>{const a=~~t,r=Math.round((t-a)*60);return`${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}`},Y=(t,a)=>{const n=a.Doping?"red":"blue",o=+c(t.target).attr("width"),s=t.clientY+o;S({e:t,posY:s,width:12.5,fillColor:n}),c("#tooltip").html(`
      ${l.FLAGS[a.Nationality]}
      <strong>
        ${a.Name}
      </strong>
      <br>
        ${a.Time} | ${a.Year.toString()}
      <br>
      <span class='text-danger'>
        ${a.Doping??""}
      </span>
    `)},v=t=>{const a=c("#graph").append("g").attr("transform","translate(40, 20)");a.append("text").attr("id","title").attr("x",-240).attr("y",20).attr("transform","rotate(-90)").text("Time in Minutes");const r=t.map(e=>e.Year);r.sort((e,i)=>e-i);const n=k().domain(r.map(e=>e.toString())).range([0,600]).paddingOuter(.625).paddingInner(1),o=O(t,e=>e.Time?d(e.Time):0)??0,s=R(t,e=>e.Time?d(e.Time):0)??0,p=b().domain([o,s]).range([350,0]),m=Array.from({length:Math.ceil((o-s)*60/15)+1},(e,i)=>s+i*15/60),g=y(n),u=L(p).tickValues(m).tickFormat(C);a.append("g").attr("transform","translate(0, 350)").call(g),a.append("g").call(u),a.selectAll("circle").data(t).enter().append("circle").attr("r",6).attr("cx",e=>n(e.Year.toString())??0).attr("cy",e=>p(d(e.Time))).style("cursor",e=>e.URL?"pointer":"auto").style("fill",e=>e.Doping?l.COLORS.darkRed:l.COLORS.darkBlue).on("mouseover",Y).on("mouseout",(e,i)=>{h(e,i.Doping?"darkRed":"darkBlue")}).on("click",x),A()},D=()=>(T("doping").then(t=>{v(t)}).catch(t=>{t instanceof Error&&console.error(t)}),f(1,"graph"));export{D as ScatterplotGraph};
