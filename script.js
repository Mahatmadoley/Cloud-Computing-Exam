const spots = [
  {
    id: 'taj',
    name: 'Taj Mahal',
    location: 'Agra, India',
    category: 'Historical',
    img: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2f0b9d79d8f8a1f98f405b4a8f9fb1b7',
    short: 'Ivory-white marble mausoleum built by Mughal emperor Shah Jahan.',
    desc: 'The Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river. It was commissioned in 1632 as a mausoleum for Mumtaz Mahal.'
  },
  {
    id: 'eiffel',
    name: 'Eiffel Tower',
    location: 'Paris, France',
    category: 'Landmark',
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=9d7f4b4a1f1f9f4c29b0b8e7d8d9e829',
    short: 'Wrought-iron lattice tower and an iconic symbol of Paris.',
    desc: 'Constructed from 1887 to 1889 for the World Fair, the Eiffel Tower stands at 324 meters and offers panoramic views over Paris.'
  },
  {
    id: 'grandcanyon',
    name: 'Grand Canyon',
    location: 'Arizona, USA',
    category: 'Nature',
    img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1c9b068a1f5a6b8b1b2b0af3e8f5ed3b',
    short: 'A vast canyon carved by the Colorado River with dramatic vistas.',
    desc: 'The Grand Canyon is a steep-sided canyon carved over millions of years, known for layered bands of red rock revealing millions of years of geological history.'
  },
  {
    id: 'machu',
    name: 'Machu Picchu',
    location: 'Cusco Region, Peru',
    category: 'Historical',
    img: 'https://images.unsplash.com/photo-1505765055404-1f14a0c55f8c?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3b0cf8b5e1a3d5b2a8f3b26c2d6d8f5a',
    short: 'Ancient Incan city set high in the Andes Mountains.',
    desc: 'Machu Picchu is a 15th-century Inca citadel located on a mountain ridge. It is renowned for its dry-stone walls and panoramic setting.'
  },
  {
    id: 'reef',
    name: 'Great Barrier Reef',
    location: 'Queensland, Australia',
    category: 'Nature',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=4e9e6f2d1e0d3c3b5d6b8a1f6b2d5c4e',
    short: 'World’s largest coral reef system rich in marine biodiversity.',
    desc: 'Stretching for over 2,300 kilometres, the Great Barrier Reef is home to a wide range of marine life and extensive coral systems.'
  }
];

const spotsGrid = document.getElementById('spotsGrid');
const searchInput = document.getElementById('searchInput');
const categoriesEl = document.getElementById('categories');
const favCountEl = document.getElementById('favCount');

let activeCategory = 'All';
let favorites = new Set(JSON.parse(localStorage.getItem('favorites') || '[]'));

function saveFavs(){
  localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
  favCountEl.textContent = favorites.size;
}

function formatCard(spot){
  return `
    <article class="card" data-id="${spot.id}">
      <img src="${spot.img}" alt="${spot.name}">
      <div class="card-body">
        <h3>${spot.name}</h3>
        <div class="muted">${spot.location} · ${spot.category}</div>
        <p>${spot.short}</p>
        <div class="meta">
          <button class="btn" data-action="open">Details</button>
          <button class="cat-btn" data-action="fav">${favorites.has(spot.id)?'★':'☆'}</button>
        </div>
      </div>
    </article>`;
}

function renderSpots(list){
  if(!list.length){
    spotsGrid.innerHTML = '<p class="muted">No spots found.</p>';
    return;
  }
  spotsGrid.innerHTML = list.map(formatCard).join('');
}

function uniqueCategories(){
  const cats = new Set(spots.map(s=>s.category));
  return ['All', ...cats];
}

function renderCategories(){
  categoriesEl.innerHTML = uniqueCategories().map(c=>{
    const active = c === activeCategory ? 'active' : '';
    return `<button class="cat-btn ${active}" data-cat="${c}">${c}</button>`;
  }).join('');
}

function filterAndRender(){
  const q = (searchInput.value || '').toLowerCase().trim();
  let filtered = spots.filter(s=>{
    const inCat = activeCategory === 'All' || s.category === activeCategory;
    const inQuery = !q || s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q) || s.short.toLowerCase().includes(q);
    return inCat && inQuery;
  });
  renderSpots(filtered);
}

// Modal
const modal = document.getElementById('spotModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalLocation = document.getElementById('modalLocation');
const modalDesc = document.getElementById('modalDesc');
const modalClose = document.getElementById('modalClose');
const favToggle = document.getElementById('favToggle');
let currentSpotId = null;

function openModal(spotId){
  const spot = spots.find(s=>s.id===spotId);
  if(!spot) return;
  currentSpotId = spotId;
  modalImage.src = spot.img;
  modalImage.alt = spot.name;
  modalTitle.textContent = spot.name;
  modalLocation.textContent = spot.location + ' · ' + spot.category;
  modalDesc.textContent = spot.desc;
  favToggle.textContent = favorites.has(spotId)?'Remove from favorites':'Add to favorites';
  modal.setAttribute('aria-hidden','false');
}

function closeModal(){
  modal.setAttribute('aria-hidden','true');
  currentSpotId = null;
}

document.addEventListener('click', (e)=>{
  const openBtn = e.target.closest('[data-action="open"]');
  if(openBtn){
    const id = openBtn.closest('.card').dataset.id;
    openModal(id);
    return;
  }
  const favBtn = e.target.closest('[data-action="fav"]');
  if(favBtn){
    const id = favBtn.closest('.card').dataset.id;
    toggleFav(id);
    renderCategories();
    filterAndRender();
    return;
  }
  const catBtn = e.target.closest('.cat-btn[data-cat]');
  if(catBtn){
    activeCategory = catBtn.dataset.cat;
    renderCategories();
    filterAndRender();
    return;
  }
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });

favToggle.addEventListener('click', ()=>{
  if(!currentSpotId) return;
  toggleFav(currentSpotId);
  favToggle.textContent = favorites.has(currentSpotId)?'Remove from favorites':'Add to favorites';
  renderCategories();
  filterAndRender();
});

function toggleFav(id){
  if(favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  saveFavs();
}

// Search
searchInput.addEventListener('input', ()=>filterAndRender());

// init
renderCategories();
filterAndRender();
saveFavs();
