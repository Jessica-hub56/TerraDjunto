import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    type: 'appeal',
    title: 'A sua participação faz a diferença!',
    content: 'O ordenamento do território é uma responsabilidade partilhada que requer a colaboração ativa de todos os munícipes. Através desta plataforma, você pode contribuir diretamente para o desenvolvimento sustentável do nosso território, participando em projetos, dando a sua opinião sobre intervenções planeadas, reportando ocorrências e acedendo a informação relevante sobre a gestão do território e resíduos sólidos. Juntos, podemos construir um futuro melhor para as nossas ilhas.',
    image: 'imagens/ilhas.png'
  },
  
  {
    type: 'island',
    name: 'Santo Antão',
    image: 'imagens/Santoantaos.jpg',
    description: 'A segunda maior ilha do arquipélago, conhecida pelas suas montanhas imponentes, vales verdejantes e trilhos espetaculares que atraem caminhantes de todo o mundo.'
  },
  {
    type: 'island',
    name: 'São Vicente',
    image: 'imagens/sao vicente.jpg',
    description: 'Ilha cultural por excelência, com a cosmopolita Mindelo, capital caboverdiana da música e das artes, e o famoso Carnaval que atrai visitantes de todo o mundo.'
  },
{
    type: 'island',
    name: 'Santa Luzia',
    image: 'imagens/Santa-Luzia.webp',
    description: 'Ilha desabitada e reserva natural, oferece paisagens pristinas e é um santuário para aves marinhas e vida selvagem única do arquipélago.'
  },
  {
    type: 'island',
    name: 'São Nicolau',
    image: 'imagens/snclau.jpg',
    description: 'Ilha montanhosa de paisagens dramáticas e contrastes marcantes, onde se destaca o imponente Monte Carneirinho, guardião de uma rica tradição literária que moldou a identidade local'
  },
  {
    type: 'island',
    name: 'Sal',
    image:'imagens/sal.webp',
    description: 'Conhecida pelas suas praias de areia branca e águas cristalinas, é o principal destino turístico do arquipélago, com o famoso resort de Santa Maria.'
  },
  {
    type: 'island',
    name: 'Boa Vista',
    image:'imagens/boavista.webp',
    description: 'Conhecida como "ilha das dunas", possui algumas das mais belas praias do arquipélago, com destaque para Santa Mónica e Curralinho, ideais para o turismo tranquilo.'
  },
  {
    type: 'island',
    name: 'Maio',
    image: 'imagens/IMaio.jpeg',
    description: 'Ilha tranquila e autêntica, conhecida pelas suas praias desertas, salinas tradicionais e pela hospitalidade calorosa dos seus habitantes.'
  },
  {
    type: 'island',
    name: 'Santiago',
    image: 'imagens/cvelha.webp',
    description: 'A maior ilha de Cabo Verde, berço da cultura crioula, com a vibrante cidade da Praia e a histórica Cidade Velha, primeiro património mundial da UNESCO no país.'
  },
  {
    type: 'island',
    name: 'Fogo',
    image:'imagens/fogo.webp',
    description: 'Dominada pelo imponente vulcão Pico do Fogo, esta ilha oferece paisagens lunares únicas e é famosa pelo seu vinho produzido nas encostas do vulcão.'
  },
  {
    type: 'island',
    name: 'Brava',
    image: 'imagens/bravo.jpg',
    description: 'A menor ilha habitada do arquipélago, conhecida como "Ilha das Flores" pela sua vegetação exuberante e paisagens montanhosas espetaculares.'
  },
  
];

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="mb-12">
      <div className="container mx-auto px-4">
        <div className="relative h-[430px] rounded-xl overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.type === 'appeal' ? 'Participação Cidadã' : slide.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              
              {slide.type === 'appeal' ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-[#004d47]/90 text-white p-8 rounded-xl max-w-4xl mx-4 text-center">
                    <h2 className="text-3xl font-bold mb-6 text-[#f0f7f4]">{slide.title}</h2>
                    <p className="text-sm leading-relaxed">{slide.content}</p>
                  </div>
                </div>
              ) : (
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-[#004d47]/80 text-white p-6 rounded-lg max-w-2xl text-center">
                  <h5 className="text-2xl font-bold mb-3">{slide.name}</h5>
                  <p className="text-sm leading-relaxed">{slide.description}</p>
                </div>
              )}
            </div>
          ))}

          {/* Navigation Buttons */}
          <button
            aria-label='Previous Slide'
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            aria-label='Next Slide'
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                aria-label={`Go to slide ${index + 1}`}
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;