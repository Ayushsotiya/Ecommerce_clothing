import React from 'react';


const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-[80vh]" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070)' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-light text-white mb-6">Our Story</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-light">
              Creating timeless fashion with a commitment to quality and sustainability
            </p>
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="py-20 bg-offWhite">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-light mb-8">Our Heritage</h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Founded in 2018, our journey began with a vision to create clothing that transcends trends while maintaining the highest standards of quality and craftsmanship.
              </p>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                What started in a small atelier has grown into a respected brand known for its attention to detail and commitment to sustainable practices.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Today, we continue to push boundaries while staying true to our core values of quality, sustainability, and timeless design.
              </p>
            </div>
            <div className="relative h-[600px]">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070"
                alt="Atelier"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 bg-offWhite">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-light mb-16 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800" 
                  alt="Quality" 
                  className="w-full h-64 object-cover mb-6"
                />
                <h3 className="text-2xl font-light mb-4">Quality</h3>
                <p className="text-gray-600">
                  Every piece is crafted with meticulous attention to detail, using the finest materials and expert craftsmanship to ensure lasting quality.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1606744888344-493238951221?q=80&w=800" 
                  alt="Sustainability" 
                  className="w-full h-64 object-cover mb-6"
                />
                <h3 className="text-2xl font-light mb-4">Sustainability</h3>
                <p className="text-gray-600">
                  We're committed to responsible fashion through sustainable materials, ethical production, and environmentally conscious practices.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800" 
                  alt="Innovation" 
                  className="w-full h-64 object-cover mb-6"
                />
                <h3 className="text-2xl font-light mb-4">Innovation</h3>
                <p className="text-gray-600">
                  We continuously explore new techniques and designs while maintaining our signature aesthetic and unwavering quality standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

   
    </div>
  );
};

export default About;