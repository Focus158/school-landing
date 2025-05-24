interface PriceElements {
  individual: HTMLElement | null;
  pack: HTMLElement | null;
  intensivo: HTMLElement | null;
}

interface DescriptionElements {
  individual: HTMLElement | null;
  pack: HTMLElement | null;
  intensivo: HTMLElement | null;
}

document.addEventListener("DOMContentLoaded", () => {
  // Animación CTA al aparecer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("opacity-0");
          entry.target.classList.add("fade-up");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const ctaSection = document.querySelector("#planes");
  if (ctaSection) {
    observer.observe(ctaSection);
  }

  // Lógica para actualizar precios y descripciones
  const setContent = (
    whatsappURL: string,
    currencySymbol: string,
    hourlyPrices: string[],
    packagePrices: string[]
  ): void => {
    const btn = document.getElementById("wspp-btn") as HTMLAnchorElement | null;
    const currencySpans = document.querySelectorAll<HTMLElement>("#precios .currency-symbol");

    const priceEls: PriceElements = {
      individual: document.getElementById("precio-individual"),
      pack: document.getElementById("precio-pack"),
      intensivo: document.getElementById("precio-intensivo"),
    };

    const descEls: DescriptionElements = {
      individual: document.getElementById("descripcion-individual"),
      pack: document.getElementById("descripcion-pack"),
      intensivo: document.getElementById("descripcion-intensivo"),
    };

    if (!btn || !priceEls.individual || !descEls.individual) return;

    btn.href = whatsappURL;
    currencySpans.forEach((el) => (el.textContent = currencySymbol));

    priceEls.individual.textContent = hourlyPrices[0];
    priceEls.pack!.textContent = hourlyPrices[1];
    priceEls.intensivo!.textContent = hourlyPrices[2];

    descEls.individual.textContent = `(paquete de 8 horas por ${currencySymbol} ${packagePrices[0]})`;
    descEls.pack!.textContent = `(paquete de 8 horas por ${currencySymbol} ${packagePrices[1]})`;
    descEls.intensivo!.textContent = `(paquete de 8 horas por ${currencySymbol} ${packagePrices[2]})`;
  };

  // Aplicar configuración por país
  const updateContentForCountry = (code: string): void => {
    if (code === "ES") {
      setContent("https://wa.me/34600111222", "€", ["10", "12.5", "15"], ["70", "87.5", "100"]);
    } else {
      // Default: Perú
      setContent("https://wa.me/51996096191", "S/.", ["30", "100", "220"], ["100", "160", "220"]);
    }
  };

  // Detectar país real o simulado (en localhost)
  if (location.hostname === "localhost") {
    const simulated = "PE"; // Cambia por "ES" si quieres testear
    console.log("País simulado:", simulated);
    updateContentForCountry(simulated);
  } else {
    fetch("https://ipinfo.io/json?token=ce97066c11fc03")
      .then((res) => res.json())
      .then((data) => {
        console.log("País detectado:", data.country);
        updateContentForCountry(data.country);
      })
      .catch(() => {
        console.log("Fallo la geolocalización, usando PE por defecto.");
        updateContentForCountry("PE");
      });
  }
});
