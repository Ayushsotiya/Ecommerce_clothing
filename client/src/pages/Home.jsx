import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import Feature1 from "@/assets/featuresection1.jpg"
import Feature2 from "@/assets/feature2.jpg"
import Feature3 from "@/assets/feature3.jpg"
import Card from "@/components/common/card"
import { Link } from 'react-router-dom';
const LatestCollection = [
  {
    title: "Summer Collection",
    subHeading: "Explore the lastest summer trends",
    image: Feature1
  },
  {
    title: "Essential Minimalism",
    subHeading: "Timeless pieces for your wardrobe",
    image: Feature2
  },
  {
    title: "Urban Elegance",
    subHeading: "Contemporary urban fashion",
    image: Feature3
  }
]

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* hero section */}
      <div
        className="h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed flex justify-center items-center"
        style={{ backgroundImage: `url(https://res.cloudinary.com/dbsrbfj8y/image/upload/v1746389586/landing_ftys2z.webp)` }}
      >
        <div className=" p-8 text-center w-[50%]">
          <h1 className="text-7xl text-black font-bold mb-4">The New Collection</h1>
          <p className="text-lg mb-6 text-black font-bold">Discover timeless elegance in our latest arrivals. Shop Now.</p>
          <Button onClick={() => navigate('/shop')} className="bg-primary text-black hover:bg-black hover:text-primary"  >Explore Now</Button>
        </div>
      </div>

     {/* feature section */}
      <div className='w-full h-full bg-offWhite flex flex-col text-center p-10'>
        <p className='text-4xl text-black my-10'>Latest Collections</p>
        <div className='flex items-center justify-center gap-x-10 '>
          {LatestCollection.map((item, index) => (
            <Card
              key={index}
              title={item.title}
              subHeading={item.subHeading}
              image={item.image} 
            ></Card>
          )
          )}
        </div>
      </div>

       {/* Editorial Section */}
      <section className="py-20 bg-offWhite ">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://res.cloudinary.com/dbsrbfj8y/image/upload/v1746389586/Editorial_Section_mdfxzo.jpg"
                alt="Editorial"
                className="w-full h-[600px]  object-cover object-center"
              />
            </div>
            <div className="max-w-xl">
              <h2 className="text-4xl font-light mb-6">The Art of Style</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Discover our curated collection of timeless pieces designed for the modern individual. Each garment is carefully crafted to embody both elegance and comfort.
              </p>
              <Link to="/shop">
                <Button variant="outline" size="lg" className="bg-primary text-black">
                  Explore Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
