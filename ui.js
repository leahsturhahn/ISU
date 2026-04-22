const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
    }
  });
},{threshold:0.2});

document.querySelectorAll('.fade-up')
  .forEach(el => observer.observe(el));

// Button click state
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Remove active state from all buttons
    document.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
    // Add active state to clicked button
    btn.classList.add('active');
  });
});