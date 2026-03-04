function hamburg(){
    const navbar = document.querySelector('.dropdown');
    navbar.style.transform = 'translateY(0px)';
}

function cancel(){
    const navbar = document.querySelector('.dropdown');
    navbar.style.transform = 'translateY(-500px)';
}

const texts = [
    "FRESHGRADUATE",
    "FIND JOB",
    
];

let speed = 100;

const textElements = document.querySelector('.typewriter-text');

let textIndex = 0;
let characterIndex = 0;

function typeWriter(){
    if(characterIndex < texts[textIndex].length){
        textElements.innerHTML += texts[textIndex].charAt(characterIndex);
        characterIndex++;
        setTimeout(typeWriter, speed);
    }
    else{
        setTimeout(eraseText, 1000);
    }
}

function eraseText(){
    if(textElements.innerHTML.length > 0){
        textElements.innerHTML = textElements.innerHTML.slice(0, -1);
        setTimeout(eraseText, 50);
    }
    else{
        textIndex = (textIndex + 1) % texts.length;
        characterIndex = 0;
        setTimeout(typeWriter, 500);
    }
}

window.onload = typeWriter;

// Tambahan: Smooth scroll ke section saat link nav diklik
document.addEventListener('DOMContentLoaded', function() {
    // Ambil semua link di nav desktop
    const navLinks = document.querySelectorAll('.nav-container .links a');
    
    // Ambil semua link di dropdown
    const dropdownLinks = document.querySelectorAll('.dropdown .links a');
    
    // Gabungkan keduanya
    const allLinks = [...navLinks, ...dropdownLinks];
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Cegah default jika href kosong
            e.preventDefault();
            
            // Ambil teks link (case insensitive)
            const text = this.textContent.trim().toLowerCase();
            
            let targetId = '';
            
            if (text.includes('home')) {
                targetId = 'home';
            } else if (text.includes('skills')) {
                targetId = 'skills';
            } else if (text.includes('tentang') || text.includes('introduction')) {
                targetId = 'tentang';
            } else if (text.includes('pendidikan')) {
                targetId = 'pendidikan';
            } else if (text.includes('pengalaman')) {
                targetId = 'pengalaman';
            } else if (text.includes('kontak') || text.includes('contact')) {
                targetId = 'kontak';
            }
            
            if (targetId) {
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    // Tutup dropdown jika dari mobile
                    cancel();  
                    
                    // Smooth scroll
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});
// Smooth scroll untuk nav links (tanpa ubah href HTML)
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-container .links a');
    const dropdownLinks = document.querySelectorAll('.dropdown .links a');
    const allLinks = [...navLinks, ...dropdownLinks];

    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const text = this.textContent.trim().toLowerCase();
            let targetId = '';

            if (text.includes('home')) targetId = 'home';
            else if (text.includes('skills')) targetId = 'skills';
            else if (text.includes('tentang') || text.includes('introduction')) targetId = 'tentang';
            else if (text.includes('pendidikan')) targetId = 'pendidikan';
            else if (text.includes('pengalaman')) targetId = 'pengalaman';
            else if (text.includes('kontak') || text.includes('contact')) targetId = 'kontak';

            if (targetId) {
                const target = document.getElementById(targetId);
                if (target) {
                    cancel(); // tutup menu mobile kalau terbuka
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
});