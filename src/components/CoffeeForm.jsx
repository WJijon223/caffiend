import { coffeeOptions } from "../utils";

export default function CoffeeForm() {
  return (
    <>
      <div className="section-header">
        <i className="fa-solid fa-pencil"></i>
        <h2>Start Tracking Today</h2>
      </div>
      <h4>Select coffee type</h4>
      <div className="coffee-grid">
        {coffeeOptions.slice(0, 5).map((option, index) => {
          return (
            <button className="button-card" key={index}>
              <h4>{option.name}</h4>
              <p>{option.caffeine}mg</p>
            </button>
          );
        })}
        <button className="button-card">
          <h4>Other</h4>
          <p>N/A</p>
        </button>
      </div>
      <select name="coffee-list" id="coffee-list">
        <option value={null}>Select Type</option>
        {coffeeOptions.map((option, index) => {
          return (
            <option value={option.name} key={index}>
              {option.name} ({option.caffeine} mg)
            </option>
          );
        })}
      </select>
      <h4>Add the cost ($)</h4>
      <input className="w-full" type="number" placeholder="4.50" />
      <h4>Time since consumption</h4>
      <div className="time-entry">
        <div>
          <h6>Hours</h6>
          <select id="hours-select">
            {[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ].map((hour, index) => {
              return (
                <option key={index} value={hour}>
                  {hour}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <h6>Minutes</h6>
          <select id="mins-select">
            {[0, 5, 10, 15, 30, 45].map((min, index) => {
              return (
                <option key={index} value={min}>
                  {min}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <button>
        <p>Add Entry</p>
      </button>
    </>
  );
}
