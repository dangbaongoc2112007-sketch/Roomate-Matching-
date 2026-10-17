const people = [
  {id:1,name:"Nguyễn Lan Anh",age:23,job:"Sinh viên thiết kế đồ họa",score:89,budget:3.5,tidy:5,smoke:false,initials:"LA",avatar:"pink-bg",bio:"Thích không gian sống sạch sẽ, yên tĩnh và thường nấu ăn tại nhà. Cuối tuần mình thích chăm cây, xem phim hoặc đi cà phê.",tags:["Dậy lúc 07:00","Ngủ trước 23:30","Rất ngăn nắp","Không hút thuốc"]},
  {id:2,name:"Hoàng Vũ Minh Quân",age:24,job:"Lập trình viên",score:86,budget:4.0,tidy:4,smoke:false,initials:"MQ",avatar:"",bio:"Lịch làm việc khá ổn định, tôn trọng không gian riêng và luôn trao đổi trước khi có khách đến chơi.",tags:["Làm việc hybrid","Gọn gàng","Không hút thuốc","Thích công nghệ"]},
  {id:3,name:"Trần Đức Minh",age:25,job:"Nhân viên phân tích dữ liệu",score:82,budget:4.5,tidy:4,smoke:false,initials:"DM",avatar:"blue-bg",bio:"Ưu tiên nhà cửa ngăn nắp và chia sẻ công việc nhà công bằng. Thường tập thể dục vào buổi sáng.",tags:["Dậy sớm","Tập thể thao","Không hút thuốc","Có lịch sinh hoạt"]},
  {id:4,name:"Phạm Thu Hà",age:22,job:"Sinh viên năm cuối",score:78,budget:3.0,tidy:3,smoke:false,initials:"TH",avatar:"pink-bg",bio:"Thân thiện, hòa đồng và thích nấu những món ăn đơn giản. Mong muốn tìm bạn cùng phòng dễ trao đổi.",tags:["Ngân sách tiết kiệm","Thích nấu ăn","Không hút thuốc","Hòa đồng"]},
  {id:5,name:"Đỗ Gia Bảo",age:24,job:"Thiết kế sản phẩm",score:74,budget:4.5,tidy:4,smoke:true,initials:"GB",avatar:"gold-bg",bio:"Làm việc sáng tạo, đôi khi có lịch linh hoạt. Mình coi trọng giao tiếp rõ ràng và sự tôn trọng lẫn nhau.",tags:["Lịch linh hoạt","Thích âm nhạc","Gọn gàng","Có hút thuốc"]},
  {id:6,name:"Lê Khánh Linh",age:23,job:"Chuyên viên truyền thông",score:71,budget:3.8,tidy:5,smoke:false,initials:"KL",avatar:"",bio:"Yêu thích nấu ăn, chăm sóc nhà cửa và những buổi tối thư giãn. Luôn chủ động chia sẻ việc nhà.",tags:["Yêu thú cưng","Rất ngăn nắp","Không hút thuốc","Nấu ăn tại nhà"]}
];
const state = {saved:new Set(), compare:new Set(), maxBudget:8, tidyOnly:false, noSmoke:false, sample:"office"};
const grid = document.getElementById("matchGrid");
const modal = document.getElementById("modalBackdrop");
const toast = document.getElementById("toast");
let toastTimer;
function notify(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2300)}
function visiblePeople(){
  let list=people.filter(p=>p.budget<=state.maxBudget && (!state.tidyOnly||p.tidy>=4) && (!state.noSmoke||!p.smoke));
  if(state.sample==="student") list=list.map(p=>({...p,score:Math.max(60,Math.min(98,p.score+(p.id===2?9:p.id===4?12:p.id===5?10:-5)))}));
  if(state.sample==="early") list=list.map(p=>({...p,score:Math.max(60,Math.min(98,p.score+(p.id===3?12:p.id===1?5:-4)))}));
  const sort=document.getElementById("sortSelect").value;
  if(sort==="budget")list.sort((a,b)=>a.budget-b.budget);else if(sort==="age")list.sort((a,b)=>a.age-b.age);else list.sort((a,b)=>b.score-a.score);
  return list;
}
function render(){
  const list=visiblePeople();
  document.getElementById("resultCount").textContent=`(${list.length} kết quả)`;
  document.getElementById("savedCount").textContent=state.saved.size;
  document.getElementById("compareCount").textContent=state.compare.size;
  document.getElementById("emptyState").hidden=list.length!==0;
  grid.innerHTML=list.map(p=>`<article class="match-card">
    <div class="card-head"><div class="person-avatar ${p.avatar}">${p.initials}</div>
      <div class="person-info"><h3>${p.name} <span class="age">(${p.age}t)</span></h3><p>${p.job}</p></div>
      <div class="match-score">✧ ${p.score}%</div>
    </div>
    <p class="bio">${p.bio}</p>
    <div class="tag-row">${p.tags.map(t=>`<span class="tag ${t.includes("Không hút")||t.includes("ngăn nắp")?"good":""}">${t}</span>`).join("")}</div>
    <div class="card-bottom"><div class="budget"><small>Ngân sách dự kiến</small>${p.budget.toFixed(1)} triệu/tháng</div>
      <div class="card-actions"><button class="icon-btn ${state.saved.has(p.id)?"saved":""}" data-action="save" data-id="${p.id}">${state.saved.has(p.id)?"♥ Đã lưu":"♡ Lưu"}</button>
      <button class="icon-btn ${state.compare.has(p.id)?"saved":""}" data-action="compare" data-id="${p.id}">${state.compare.has(p.id)?"✓ Đã chọn":"⇄ So sánh"}</button>
      <button class="primary-button" data-action="detail" data-id="${p.id}">Xem hồ sơ</button></div>
    </div></article>`).join("");
}
function openModal(){modal.hidden=false}
function closeModal(){modal.hidden=true}
document.getElementById("filterBtn").addEventListener("click",openModal);
document.getElementById("editLifestyle").addEventListener("click",()=>notify("Tính năng chỉnh sửa hồ sơ mẫu đang ở chế độ minh họa."));
document.getElementById("profileBtn").addEventListener("click",()=>notify("Đây là hồ sơ nếp sống mẫu của Hoàng Minh Anh."));
document.getElementById("closeModal").addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.getElementById("maxBudget").addEventListener("input",e=>document.getElementById("budgetValue").textContent=`${e.target.value} triệu`);
document.getElementById("applyFilters").addEventListener("click",()=>{
  state.maxBudget=Number(document.getElementById("maxBudget").value);
  state.tidyOnly=document.getElementById("tidyOnly").checked;
  state.noSmoke=document.getElementById("noSmoke").checked;
  closeModal();render();notify("Đã cập nhật bộ lọc sinh hoạt.");
});
document.getElementById("resetFilters").addEventListener("click",()=>{
  document.getElementById("maxBudget").value=8;document.getElementById("budgetValue").textContent="8 triệu";
  document.getElementById("tidyOnly").checked=false;document.getElementById("noSmoke").checked=false;
  state.maxBudget=8;state.tidyOnly=false;state.noSmoke=false;render();
});
document.getElementById("sortSelect").addEventListener("change",render);
document.querySelectorAll(".sample").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".sample").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
  state.sample=btn.dataset.sample;render();notify("Đã cập nhật kiểu nếp sống mẫu.");
}));
grid.addEventListener("click",e=>{
  const btn=e.target.closest("button[data-action]");if(!btn)return;
  const id=Number(btn.dataset.id),action=btn.dataset.action,p=people.find(x=>x.id===id);
  if(action==="save"){state.saved.has(id)?state.saved.delete(id):state.saved.add(id);render();notify(state.saved.has(id)?"Đã lưu hồ sơ vào danh sách.":"Đã bỏ hồ sơ khỏi danh sách đã lưu.");}
  if(action==="compare"){
    if(!state.compare.has(id)&&state.compare.size>=2){notify("Bạn chỉ có thể chọn tối đa 2 hồ sơ để so sánh.");return}
    state.compare.has(id)?state.compare.delete(id):state.compare.add(id);render();
    if(state.compare.size===2){const chosen=people.filter(x=>state.compare.has(x.id));notify(`Đang so sánh: ${chosen[0].name} và ${chosen[1].name}`)}else notify(state.compare.has(id)?"Đã thêm vào danh sách so sánh.":"Đã bỏ khỏi danh sách so sánh.");
  }
  if(action==="detail")notify(`${p.name} · ${p.age} tuổi · Tương thích ${p.score}% · ${p.budget.toFixed(1)} triệu/tháng`);
});
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
render();