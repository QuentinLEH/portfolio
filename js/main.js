document.addEventListener("DOMContentLoaded", () => {
  // Enregistrer le plugin ScrollSmoother de GSAP
  gsap.registerPlugin(ScrollSmoother);

  // Créer un effet de scroll fluide
  ScrollSmoother.create({
      wrapper: ".content",   // Cible l'élément qui contient le scroll
      content: ".content-inner",  // Cible l'élément à faire défiler
      smooth: window.innerWidth > 768 ? 3 : 1.5,  // Fluidité du scroll (plus faible sur mobile)
      effects: true,  // Active les effets d'animation pendant le scroll
  });
});