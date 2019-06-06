let averageFeePercentage = 0;
let rewardToken;
function getById(name) {
  return document.getElementById(name);
}

function calculateFeeInDollar() {
  let data = {};
  const daily = getById("dailyVolume").value;
  averageFee = getById("averageFee").value;
  data.daily = daily;
  data.averageFee = averageFee;
  $.ajax({
    type: "post",
    data: JSON.stringify(data),
    contentType: "application/json",
    dataType: "json",
    url: "/calculate",
    success: function(result) {
      averageFeePercentage = result;
      console.log("Dollar", result);
      getById("averageFeePercentage").innerHTML = roundOff(validation(result));
    },
    error: function(error) {
      console.log("Some error");
    }
  });
}

function calculateRewardToken(rewardLoyaltyPer = 15) {
  let data = {};
  const stake = getById("numberOfStake").value;
  let loyaltyToken = document.getElementById("exampleFormControlSelect1");
  loyaltyToken = loyaltyToken.options[loyaltyToken.selectedIndex].value;
  data.stake = stake;
  data.loyaltyToken = loyaltyToken;

  if (averageFeePercentage === null) {
    confirm("You miss average fee $. Reward per token need it.");
  }
  $.ajax({
    type: "post",
    data: JSON.stringify(data),
    contentType: "application/json",
    dataType: "json",
    url: "/calculateToken",
    success: function(result) {
      rewardToken = result;
      console.log("Result", result);
      if (result === null) {
        getById("rewardToken").innerText = "No data";
      } else {
        getById("rewardToken").innerText = roundOff(validation(result));
      }
    },
    error: function(error) {
      console.log("Some error");
    }
  });
}

function onSubmit() {
  let data = {};
  const holdingToken = getById("holdingToken").value;
  data.holdingToken = holdingToken;
  console.log(holdingToken, rewardToken);
  if (
    holdingToken === "" ||
    rewardToken === undefined ||
    rewardToken === null ||
    rewardToken === NaN ||
    rewardToken === 0
  ) {
    confirm("You may be missing some value.");
  }
  $.ajax({
    type: "post",
    data: JSON.stringify(data),
    contentType: "application/json",
    dataType: "json",
    url: "/calculateTotalEarning",
    success: function(result) {
      getById("dailyCalc").innerHTML = validation(roundOff(result.earnPerDay));
      getById("weeklyCalc").innerHTML = validation(
        roundOff(result.earnPerWeek)
      );
      getById("yearlyCalc").innerHTML = validation(
        roundOff(result.earnPerMonth)
      );
    },
    error: function(error) {
      console.log("Some error");
    }
  });
}

function roundOff(number) {
  if (number) {
    return parseFloat(number.toFixed(6));
  }
  return number;
}
function validation(number) {
  if (isNaN(number) || !isFinite(number) || number === undefined) {
    return "No result";
  }
  return number;
}
