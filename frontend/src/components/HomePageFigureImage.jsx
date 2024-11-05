const FigureImage = ({ image, alt, title, text, reverse = false }) => {
  return (
    <figure
      className={`flex flex-col-reverse ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} flex-wrap gap-10 justify-center items-center`}
    >
      <img
        src={image}
        className="lg:w-2/3 rounded-xl shadow-xl"
        alt={alt}
        loading="lazy"
      />
      <figcaption
        className={`sm:text-center ${reverse ? "lg:text-right" : "lg:text-left"} min-w-md max-w-lg flex-1 space-y-3`}
      >
        <h2 className="font-kanit text-3xl lg:text-5xl">{title}</h2>
        <p className="font-poppins font-extralight text-base lg:text-lg">
          {text}
        </p>
      </figcaption>
    </figure>
  );
};

export default FigureImage;
