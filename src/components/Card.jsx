const Card = ({ title, icon, desc, extDesc }) => {
  return (
    <div className="w-full max-w-sm bg-violet-100 border border-gray-200 rounded-lg shadow p-3">
      <div className="flex text-wrap gap-x-2 items-center justify-center mx-1 mt-1 mb-3">
        <span className="font-semibold font-mono text-lg">{title}</span> {icon}
      </div>
      <div className="flex mt-3 mx-1 mb-1 pb-2 justify-center items-center">
        <span>
          {desc} {extDesc}
        </span>
      </div>
    </div>
  );
};

export default Card;
