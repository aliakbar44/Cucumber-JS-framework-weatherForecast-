Feature: Weather forecast updates

Scenario Outline: Enter city name, get 5 day weather forecast

  Given Open browser and Start weather forecast Application

  When Clear the Search Field and user enters "<searchValue>" in City Field

  Then user should see the weather forecast page for the entered City

  When user click on the "<day>"

  Then user should see the hourly weather forecast

  When user sees the Most dominant condition with wind speed in Summary
  Then user verifies the wind speed from detailed section

  When user sees the Maximum temperature in Summary
  Then  user verifies and summarise the day header values with hourly updates

  When user sees the Minimum temperature in Summary
  Then user summarise the day header values with hourly updates for minimum temperature

  When user sees the Aggregate rainfall in Summary
  Then user verifies the aggregate rainfall from details section

  And user verify and confirm that all values are rounded down

  When user clicks on the "<day>" again

  Then user should not see the hourly weather forecast since it is collapsed



  Examples:
  |searchValue|day|
  |Perth   |Tue  |


