import{s as Y,n as I}from"../chunks/scheduler.BiCo1YSR.js";import{S as U,i as G,e as n,s as b,c as a,a as K,o as i,f as k,d as O,k as g,y,g as Q,h as t}from"../chunks/index.CRrunSqy.js";const X=!1,et=Object.freeze(Object.defineProperty({__proto__:null,prerender:X},Symbol.toStringTag,{value:"Module"}));function Z(V){let l,_,P='<meta charset="UTF-8"/> <meta name="viewport" content="width=device-width, initial-scale=1.0"/> <title>Домашняя страница Kolmit</title> <link rel="stylesheet" href="styles.css"/>',E,e,p,z="<h1>Добро пожаловать в Kolmit</h1> <p>Ваше приложение для изучения иностранных языков</p>",H,x,q='<ul class="svelte-19uk3xr"><li class="svelte-19uk3xr"><a href="#" class="svelte-19uk3xr">Главная</a></li> <li class="svelte-19uk3xr"><a href="#" class="svelte-19uk3xr">О нас</a></li> <li class="svelte-19uk3xr"><a href="#" class="svelte-19uk3xr">Учебные материалы</a></li> <li class="svelte-19uk3xr"><a href="#" class="svelte-19uk3xr">Контакты</a></li></ul>',M,m,w=`<section class="svelte-19uk3xr"><h2>О нас</h2> <p id="about-text">Мы - команда разработчиков, увлеченных изучением иностранных языков. Наше приложение
					Kolmit создано для того, чтобы помочь вам в этом нелегком деле.</p></section> <section class="svelte-19uk3xr"><h2>Учебные материалы</h2> <p id="materials-text">У нас есть обширная библиотека учебных материалов на различных языках. Вы можете начать
					изучение прямо сейчас!</p></section>`,j,h,A="<p>© 2024 Kolmit. Все права защищены.</p>",N,o,r,B="Русский",u,W="English",d,D="Nederlands",c,F="Español",v,R="Français",S,f,J=`// JavaScript для изменения контента при выборе языка
			const languageSelect = document.getElementById('language-select');
			const aboutText = document.getElementById('about-text');
			const materialsText = document.getElementById('materials-text');

			languageSelect.addEventListener('change', function () {
				const selectedLanguage = languageSelect.value;

				if (selectedLanguage === 'ru') {
					aboutText.textContent =
						'Мы - команда разработчиков, увлеченных изучением иностранных языков. Наше приложение Kolmit создано для того, чтобы помочь вам в этом нелегком деле.';
					materialsText.textContent =
						'У нас есть обширная библиотека учебных материалов на различных языках. Вы можете начать изучение прямо сейчас!';
				} else if (selectedLanguage === 'en') {
					aboutText.textContent =
						'We are a team of developers passionate about learning foreign languages. Our Kolmit app is designed to help you in this challenging endeavor.';
					materialsText.textContent =
						'We have an extensive library of educational materials in various languages. You can start learning right now!';
				} else if (selectedLanguage === 'nl') {
					aboutText.textContent =
						'Wij zijn een team van ontwikkelaars die gepassioneerd zijn over het leren van vreemde talen. Onze Kolmit-app is ontworpen om je te helpen bij deze uitdagende onderneming.';
					materialsText.textContent =
						'We hebben een uitgebreide bibliotheek met educatief materiaal in verschillende talen. Je kunt nu beginnen met leren!';
				} else if (selectedLanguage === 'es') {
					aboutText.textContent =
						'Somos un equipo de desarrolladores apasionados por aprender idiomas extranjeros. Nuestra aplicación Kolmit está diseñada para ayudarte en este desafiante proceso.';
					materialsText.textContent =
						'Tenemos una amplia biblioteca de materiales educativos en varios idiomas. ¡Puedes comenzar a aprender ahora mismo!';
				} else if (selectedLanguage === 'fr') {
					aboutText.textContent =
						"Nous sommes une équipe de développeurs passionnés par l'apprentissage des langues étrangères. Notre application Kolmit est conçue pour vous aider dans cette entreprise exigeante.";
					materialsText.textContent =
						'Nous avons une vaste bibliothèque de matériel éducatif dans diverses langues. Vous pouvez commencer à apprendre dès maintenant !';
				}
			});`;return{c(){l=n("html"),_=n("head"),_.innerHTML=P,E=b(),e=n("body"),p=n("header"),p.innerHTML=z,H=b(),x=n("nav"),x.innerHTML=q,M=b(),m=n("main"),m.innerHTML=w,j=b(),h=n("footer"),h.innerHTML=A,N=b(),o=n("select"),r=n("option"),r.textContent=B,u=n("option"),u.textContent=W,d=n("option"),d.textContent=D,c=n("option"),c.textContent=F,v=n("option"),v.textContent=R,S=b(),f=n("script"),f.textContent=J,this.h()},l(L){l=a(L,"HTML",{lang:!0});var C=K(l);_=a(C,"HEAD",{"data-svelte-h":!0}),i(_)!=="svelte-xut2jm"&&(_.innerHTML=P),E=k(C),e=a(C,"BODY",{});var s=K(e);p=a(s,"HEADER",{class:!0,"data-svelte-h":!0}),i(p)!=="svelte-10gip9a"&&(p.innerHTML=z),H=k(s),x=a(s,"NAV",{class:!0,"data-svelte-h":!0}),i(x)!=="svelte-ny1ykt"&&(x.innerHTML=q),M=k(s),m=a(s,"MAIN",{class:!0,"data-svelte-h":!0}),i(m)!=="svelte-k20qj1"&&(m.innerHTML=w),j=k(s),h=a(s,"FOOTER",{class:!0,"data-svelte-h":!0}),i(h)!=="svelte-3e0agz"&&(h.innerHTML=A),N=k(s),o=a(s,"SELECT",{id:!0,class:!0});var T=K(o);r=a(T,"OPTION",{"data-svelte-h":!0}),i(r)!=="svelte-kb8mvn"&&(r.textContent=B),u=a(T,"OPTION",{"data-svelte-h":!0}),i(u)!=="svelte-1bjraht"&&(u.textContent=W),d=a(T,"OPTION",{"data-svelte-h":!0}),i(d)!=="svelte-hi7116"&&(d.textContent=D),c=a(T,"OPTION",{"data-svelte-h":!0}),i(c)!=="svelte-128r36l"&&(c.textContent=F),v=a(T,"OPTION",{"data-svelte-h":!0}),i(v)!=="svelte-r9p3ar"&&(v.textContent=R),T.forEach(O),S=k(s),f=a(s,"SCRIPT",{"data-svelte-h":!0}),i(f)!=="svelte-lqsuaj"&&(f.textContent=J),s.forEach(O),C.forEach(O),this.h()},h(){g(p,"class","svelte-19uk3xr"),g(x,"class","svelte-19uk3xr"),g(m,"class","svelte-19uk3xr"),g(h,"class","svelte-19uk3xr"),r.__value="ru",y(r,r.__value),u.__value="en",y(u,u.__value),d.__value="nl",y(d,d.__value),c.__value="es",y(c,c.__value),v.__value="fr",y(v,v.__value),g(o,"id","language-select"),g(o,"class","svelte-19uk3xr"),g(l,"lang","ru")},m(L,C){Q(L,l,C),t(l,_),t(l,E),t(l,e),t(e,p),t(e,H),t(e,x),t(e,M),t(e,m),t(e,j),t(e,h),t(e,N),t(e,o),t(o,r),t(o,u),t(o,d),t(o,c),t(o,v),t(e,S),t(e,f)},p:I,i:I,o:I,d(L){L&&O(l)}}}class nt extends U{constructor(l){super(),G(this,l,null,Z,Y,{})}}export{nt as component,et as universal};
