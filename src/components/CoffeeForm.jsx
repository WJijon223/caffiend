import { coffeeOptions } from "../utils";
import { use, useState } from "react";
import Modal from "./Modal";
import Authentication from "./Authentication";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function CoffeeForm(props) {
  const { isAuthenticated } = props;
  const [showModal, setShowModal] = useState(false);

  const [selectedCoffee, setSelectedCoffee] = useState(null);
  const [showCoffeeTypes, setShowCoffeeTypes] = useState(false);
  const [coffeeCost, setCoffeeCost] = useState(0);
  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);

  const { globalData, setGlobalData, globalUser } = useAuth();

  async function handleSubmitForm() {
    if (!isAuthenticated) {
      setShowModal(true);
      return;
    }

    // define a guard clause that only submits the forms if it is completed
    if (!selectedCoffee) {
      return;
    }

    try {
      // then create new data object
      const newGlobalData = {
        ...(globalData || {}),
      };

      const nowTime = Date.now();
      const timeToSubtract = hour * 60 * 60 * 1000 + min * 60 * 1000;
      const timestamp = nowTime - timeToSubtract;

      const newData = {
        name: selectedCoffee,
        cost: coffeeCost,
      };

      newGlobalData[timestamp] = newData;
      console.log(timestamp, selectedCoffee, coffeeCost);

      // update the global state
      setGlobalData(newGlobalData);

      //persist the data in the firebase firestore
      const userRef = doc(db, "users", globalUser.uid);
      const res = await setDoc(
        userRef,
        {
          [timestamp]: newData,
        },
        { merge: true }
      );
    } catch (err) {
      console.log(err.message);
    }

    setSelectedCoffee(null);
    setHour(0);
    setMin(0);
    setCoffeeCost(0);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  return (
    <>
      {showModal && (
        <Modal handleCloseModal={handleCloseModal}>
          <Authentication handleCloseModal={handleCloseModal} />
        </Modal>
      )}
      <div className="section-header">
        <i className="fa-solid fa-pencil"></i>
        <h2>Start Tracking Today</h2>
      </div>
      <h4>Select coffee type</h4>
      <div className="coffee-grid">
        {coffeeOptions.slice(0, 5).map((option, index) => {
          return (
            <button
              onClick={() => {
                setSelectedCoffee(option.name);
                setShowCoffeeTypes(false);
              }}
              className={
                "button-card " +
                (selectedCoffee === option.name ? "coffee-button-selected" : "")
              }
              key={index}
            >
              <h4>{option.name}</h4>
              <p>{option.caffeine}mg</p>
            </button>
          );
        })}
        <button
          onClick={() => {
            setShowCoffeeTypes(true);
            setSelectedCoffee(null);
          }}
          className={
            "button-card " + (showCoffeeTypes ? "coffee-button-selected" : "")
          }
        >
          <h4>Other</h4>
          <p>N/A</p>
        </button>
      </div>
      {showCoffeeTypes && (
        <select
          onChange={(event) => {
            setSelectedCoffee(event.target.value);
          }}
          name="coffee-list"
          id="coffee-list"
        >
          <option value={null}>Select Type</option>
          {coffeeOptions.map((option, index) => {
            return (
              <option value={option.name} key={index}>
                {option.name} ({option.caffeine} mg)
              </option>
            );
          })}
        </select>
      )}
      <h4>Add the cost ($)</h4>
      <input
        className="w-full"
        type="number"
        value={coffeeCost}
        onChange={(event) => {
          setCoffeeCost(event.target.value);
        }}
        placeholder="4.50"
      />
      <h4>Time since consumption</h4>
      <div className="time-entry">
        <div>
          <h6>Hours</h6>
          <select
            id="hours-select"
            onChange={(event) => {
              setHour(event.target.value);
            }}
          >
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
          <select
            id="mins-select"
            onChange={(event) => {
              setMin(event.target.value);
            }}
          >
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
      <button onClick={handleSubmitForm}>
        <p>Add Entry</p>
      </button>
    </>
  );
}
