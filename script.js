async function loadContent(){
  try{
    const r = await fetch('content/site.json', {cache:'no-store'});
    if(!r.ok) return;
    const data = await r.json();

    // Hero
    if(data.hero){
      document.getElementById('heroTitle').textContent = data.hero.title || 'Build Your Own Sandwich';
      document.getElementById('heroTag').textContent = data.hero.tagline || '';
      const heroCta = document.getElementById('heroCta');
      heroCta.textContent = data.hero.cta_text || 'Order Online';
      heroCta.href = data.hero.cta_link || 'https://deli-delux.square.site';
      document.querySelector('.hero').style.setProperty('--hero', `url('${data.hero.image || 'images/hero.png'}')`);
    }

    // Panels
    (data.panels||[]).forEach((p, i)=>{
      const title = document.getElementById(`panel${i}Title`);
      const text = document.getElementById(`panel${i}Text`);
      const img = document.getElementById(`panel${i}Img`);
      const cta = document.getElementById(`panel${i}Cta`);
      if(title) title.textContent = p.title || title.textContent;
      if(text) text.textContent = p.text || text.textContent;
      if(img && p.image) img.src = p.image;
      if(cta && p.cta_link) cta.href = p.cta_link;
      if(cta && p.cta_text) cta.textContent = p.cta_text;
    });

    // Menu
    const categories = data.menu || {};
    const tabs = document.querySelectorAll('.tab');
    const list = document.getElementById('menuList');

    function render(cat){
      list.innerHTML = '';
      const items = (categories[cat]||[]);
      items.forEach(row=>{
        const li = document.createElement('li');
        li.className = 'menu-item';
        const name = document.createElement('span');
        name.className = 'name';
        name.textContent = row.name;
        const price = document.createElement('span');
        price.className = 'price';
        price.textContent = row.price || '';
        li.append(name, price);
        list.appendChild(li);
      });
    }

    tabs.forEach(btn=>{
      btn.addEventListener('click',()=>{
        document.querySelector('.tab.active')?.classList.remove('active');
        btn.classList.add('active');
        render(btn.dataset.cat);
      });
    });

    // render default active tab
    render(document.querySelector('.tab.active').dataset.cat);

    // About / Contact
    if(data.about) document.getElementById('aboutText').textContent = data.about;
    if(data.contact){
      document.getElementById('addr').textContent = data.contact.address || '';
      document.getElementById('hours').textContent = data.contact.hours || '';
      const email = document.getElementById('email');
      if(data.contact.email){ email.textContent = data.contact.email; email.href = 'mailto:'+data.contact.email; }
      const top = document.getElementById('orderTop');
      if(data.contact.order_link){ top.href = data.contact.order_link; }
    }

  }catch(e){ console.warn('content load failed', e); }
}
document.addEventListener('DOMContentLoaded', loadContent);
