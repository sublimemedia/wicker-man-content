'use strict';

const expect = require("chai").expect;
const Content = require("../dist/WMContent");

describe("Can be created", function() {
  const content = new Content();

  it("Can instantiate", function() {
    expect(content).to.be.an('object');
  });
});

describe("Sets and gets", function() {
  const content = new Content(),
    setProp = 'test',
    setVal = 10;

  it("Sets and gets values correctly", function() {
    content.set(setProp, setVal);
    expect(content.get(setProp)).to.equal(setVal);
  });

  it("Overwrites previously set values", function() {
    const newVal = 'foo';

    content.set(setProp, newVal);
    expect(content.get(setProp)).to.equal(newVal);
  });

  // Sets/gets namespaced
});

// Observes
