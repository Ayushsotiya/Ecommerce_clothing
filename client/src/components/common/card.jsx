import { Button } from "@/components/ui/button";
const Card = ({ title, subHeading, image }) => {
    return (
      <div
        className="bg-cover bg-center  shadow-lg p-6 flex flex-col justify-end"
        style={{ backgroundImage: `url(${image})`, height: '400px',width:"300px" }}
      >
        <div className="bg-black bg-opacity-10 text-white items-center p-2 rounded-lg flex flex-col gap-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm mb-5">{subHeading}</p>
          <Button className="w-24">Discover</Button>
        </div>
      </div>
    );
  };
  
  export default Card;
  