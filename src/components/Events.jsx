import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const Events = ({ events, mobile }) => {
  const navigate = useNavigate();

  const wideScreenStyle = "hidden sm:flex flex-col items-center gap-10 w-[90%] sm:w-[20%] h-screen border-l-[1px] border-primary-dark overflow-y-auto text-primary-text pl-5 pt-[15vh] pb-[4vh]";
  const mobileScreenStyle = "flex flex-col items-center w-[calc(100vw-6px)] min-h-screen gap-10 bg-background text-primary-text mb-[15vh] pt-[15vh]";

  const handleEventClick = (id) => {
    navigate(`/post/${id}`);
  };

  return (
    <div className={`${mobile ? mobileScreenStyle : wideScreenStyle}`}>
      <h1 className="sm:text-[17px] text-[20px] font-bold w-full pl-4">
        Events Calendar
      </h1>
      <div className="flex flex-col gap-4 w-full rounded-md px-4">
        {events.map((event, index) => (
          <div 
            key={index} 
            className="flex-col w-full text-[15px] sm:p-0 p-3 sm:border-0 border-b-[1px] border-gray-300 cursor-pointer"
            onClick={() => handleEventClick(event.id)}
          >
            <div className="flex sm:flex-col flex-row sm:justify-center justify-between gap-2">
              <span className="font-medium sm:text-gray-400 w-1/2 sm:w-fit sm:text-sm">
                {new Date(event.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <div className="w-1/2 sm:w-fit">  
                <h3 className="font-bold sm:text-[17px] text-[20px] sm:cursor-pointer pb-1">{event.title}</h3>
                <span className="sm:text-[15px] text-[12px] sm:font-normal font-medium">{event.venue}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <Footer /> */}
    </div>
  );
};

Events.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      venue: PropTypes.string.isRequired,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Assuming 'id' is either a string or number
    })
  ).isRequired,
  mobile: PropTypes.bool, // Added mobile prop validation
};

const MemoizedEvents = React.memo(Events);
export default MemoizedEvents;
