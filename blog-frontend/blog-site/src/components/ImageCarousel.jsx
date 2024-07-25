import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// eslint-disable-next-line react/prop-types
export const ImageCarousel = ({ images }) => {
  return (
    <Carousel
      showArrows={true}
      showThumbs={false}
      infiniteLoop={true}
      useKeyboardArrows={true}
      autoPlay={true}
      stopOnHover={true}
      showStatus={false}
      className="rounded-md overflow-hidden"
    >
      {/*  eslint-disable-next-line react/prop-types */}
      {images?.map((image, index) => (
        <div key={index}>
          <img
            src={image.original_url}
            alt={`Slide ${index}`}
            className="w-full h-64 md:h-96 object-cover"
            width={100}
            height={100}
          />
        </div>
      ))}
    </Carousel>
  );
};
