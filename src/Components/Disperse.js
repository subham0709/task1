import React, { useState,useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { BiErrorCircle } from "react-icons/bi";

const Disperse = () => {
  const [inputValue, setInputValue] = useState("");
  const [errorType, setErrorType] = useState(1);
  const [errorMessage, setErrorMessage] = useState([]);
  const [error, setError] = useState(false);
  const [lineNumber, setLineNumber] = useState([1]);
  const [addresses, setAddresses] = useState([]);
  const [amount, setAmount] = useState([]);
  const [addressesWithAmount, setAddressesWithAmount] = useState([]);
  const textValue=useRef(null);

  // handleOnChange
  const handleOnChange = (event) => {
    let data = event.target.value;
    setInputValue(data);
    let lines = data.split("\n");
    let array = Array.from({ length: lines.length }, (v, i) => i + 1);
    setLineNumber(array);
    setAddressesWithAmount(lines);
    setError(false);
    setErrorMessage([]);
    setAmount([]);
    setAddresses([]);
  };

  // onSubmit method
  const onSubmit = () => {
    let eM = [];
    let address = [];
    let amnt = [];
    let wrongAmount = false;
    //Checking wrong amount details
    addressesWithAmount.forEach((element, index) => {
      let add = element.split(/ |,|=| | /);
      if (/[^0-9.]/.test(add[1])) {
        eM.push(`Line ${index + 1} wrong amount`);
        setError(true);
        wrongAmount = true;
        setErrorType(1);
      }
      if (true) {
        address.push(add[0]);
        amnt.push(Number(add[1]));
      }
    });

    //Checking for duplicate
    if (!wrongAmount) {
      let UniqueAdd = [];
      let noOfOcc = {};
      for (const item of address) {
        if (!UniqueAdd.includes(item)) {
          UniqueAdd.push(item);
        }
      }
      for (const element of UniqueAdd) {
        const indices = [];
        address.forEach((item, index) => {
          if (item === element) {
            indices.push(index + 1);
          }
        });
        noOfOcc[element] = { indices };
      }

      UniqueAdd.forEach((element) => {
        if (noOfOcc[element].indices.length > 1) {
          setErrorType(2);
          setError(true);
          eM.push(
            `Address ${element} encountered duplicate in Line: ${noOfOcc[
              element
            ].indices.toString()}`
          );
        }
      });
    }
    setAddresses(address);
    setAmount(amnt);
    setErrorMessage(eM);
  };

  //Keep First One Method
  const keepFirstOne = () => {
    let text = "";
    let UniqueAdd = [];
    let lines = [];
    for (const item of addresses) {
      if (!UniqueAdd.includes(item)) {
        UniqueAdd.push(item);
      }
    }
    UniqueAdd.forEach((element, i) => {
      const index = addresses.findIndex((item) => item === element);
      text += `${element} ${amount[index]}`;
      lines.push(i + 1);
      if (i !== UniqueAdd.length - 1) {
        text += "\n";
      }
    });
    setInputValue(text);
    setLineNumber(lines);
    setError(false);
    setAddressesWithAmount([]);

  };

  //CombineBalance Method
  const combineBalances = () => {
    let text = "";
    let UniqueAdd = [];
    let noOfOcc = {};
    let lines = [];
    for (const item of addresses) {
      if (!UniqueAdd.includes(item)) {
        UniqueAdd.push(item);
      }
    }
    for (const element of UniqueAdd) {
      const indices = [];
      addresses.forEach((item, index) => {
        if (item === element) {
          indices.push(index + 1);
        }
      });
      noOfOcc[element] = { indices };
    }
    UniqueAdd.forEach((element, index) => {
      let a = noOfOcc[element].indices;
      let amnt = 0;
      a.forEach((i) => {
        amnt += amount[i - 1];
      });
      lines.push(index + 1);
      text += element + " " + amnt;
      if (index !== UniqueAdd.length - 1) {
        text += "\n";
      }
    });
    setInputValue(text);
    setLineNumber(lines);
    setError(false);
    setAddressesWithAmount([]);
  };
  return (
    <div className="my-3 container" style={{ width: "60%" }}>
      {/* Addresses with amount text */}
      <div style={{ color: "grey", paddingBottom: "10px", paddingLeft: "5px" }}>
        Addresses with Amounts
      </div>
      {/* Input Field */}
      <div
        className="container ps-5 pt-3 pb-3 d-flex"
        style={{
          backgroundColor: "#f5f6fa",
          height: "300px",
        }}
      >
        {/* Printing Line Numbers */}
        <div className="d-flex flex-column pt-1" style={{ color: "grey" }}>
          {lineNumber.map((count) => (
            <div key={count}>
              <strong>{count}</strong>
            </div>
          ))}
        </div>

        {/* Making a vertical line */}
        <div className="vr my-1 ms-1" style={{ color: "grey" }} />

        {/* Text Area */}
        <Form.Control
          ref={textValue}
          value={inputValue}
          onChange={handleOnChange}
          as="textarea"
          className="my-1 mx-1 b-0 "
          wrap="false"
          style={{ all: "unset", width: "100%", fontWeight: "bold" }}
        ></Form.Control>
      </div>
      {/* Separated by ',' or ' ' or '=' text */}
      <div style={{ color: "grey", paddingLeft: "5px" }}>
        Separated by ',' or ' ' or '='
      </div>

      {/* warning box  */}
      {error && (
        <div className="mt-3">
          {errorType === 2 && (
            <div
              className="d-flex justify-content-between mx-1 mb-2"
              style={{ color: "red" }}
            >
              <div>Duplicated</div>
              <div>
                <Button
                  variant="link"
                  style={{ all: "unset", cursor: "pointer" }}
                  onClick={keepFirstOne}
                >
                  Keep the first one
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
                <Button
                  variant="ling"
                  style={{ all: "unset", cursor: "pointer" }}
                  onClick={combineBalances}
                >
                  Combine Balance
                </Button>
              </div>
            </div>
          )}
          <div
            style={{
              border: "1px solid red",
              borderRadius: "5px",
              color: "red",
            }}
            className="p-2 mb-3 d-flex"
          >
            <BiErrorCircle
              size={"25"}
              color="red"
              style={{ marginRight: "40px" }}
            />

            <div className="d-flex flex-column">
              {errorMessage.map((e) => (
                <div key={e}>{e}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Button for Next */}
      <Button
        style={{ width: "100%", height: "50px", cursor: "pointer" }}
        className="mt-3"
        onClick={(inputValue!=="")?onSubmit:console.log()}
      >
        Next
      </Button>
    </div>
  );
};

export default Disperse;
