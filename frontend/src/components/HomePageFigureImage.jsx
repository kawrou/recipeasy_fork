const FigureImage = ({ image, title, text }) => {
  return (
    <figure className="">
      <img
        src={image}
        className="lg:w-2/3 mx-auto rounded-xl shadow-xl"
        alt="Introducing how to import a recipe with url"
        loading="lazy"
      />
      <figcaption className="bg-white m-7 p-4 rounded-xl shadow-xl lg:w-1/3 lg:mx-auto">
        <h2 className="font-kanit text-lg lg:text-2xl">{title}</h2>
        <p className="font-poppins text-sm lg:text-lg">{text} </p>
      </figcaption>
    </figure>
  );
};

export default FigureImage;
