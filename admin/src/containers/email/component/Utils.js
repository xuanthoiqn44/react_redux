import React from "react";
import namor from "namor";
// import {connect} from "react-redux";
// import {emailActions} from "../../../redux/actions/emailActions";


const mapStateToProps = (state) => ({
    notifies: state.notify.notifies
});
const range = len => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newEmail = () => {
  const statusChance = Math.random();
  return {
    number: namor.generate({ words: 1, numbers: 0 }),
    title: namor.generate({ words: 1, numbers: 0 }),
    dateCreate: namor.generate({ words: 1, numbers: 0 }),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status:
      statusChance > 0.66
        ? "relationship"
        : statusChance > 0.33 ? "complicated" : "single"
  };
};

export function makeData(len = 5553) {
  return range(len).map(d => {
    return {
      ...newEmail(),
      children: range(10).map(newEmail)
    };
  });
}