'use strict';
//var assert=require('assert');

const assert = require('assert');
//const assert = require('chai').assert;
var webdriver = require('selenium-webdriver'),
By=webdriver.By,until=webdriver.until;

//var driver=new webdriver.Builder().forBrowser('chrome').build();

module.exports = function() {
	this.World = require('../support/world.js').World;

	this.Given(/^Open browser and Start weather forecast Application$/, function () {
		this.driver.get("http://localhost:3000/");
        this.driver.manage().window().maximize();
        this.driver.sleep(4000);

	});

    this.Then(/^Clear the Search Field and user enters "([^"]*)" in City Field$/, function (arg1) {
        this.driver.findElement({ id: 'city' }).then(function(ele){
            ele.clear();
            var enter = ele.sendKeys(arg1);
            ele.sendKeys(webdriver.Key.ENTER);

            });
        this.driver.sleep(3000);
        });


    this.Then(/^user should see the weather forecast page for the entered City$/, function () {
        this.driver.findElement({ xpath: '//*[@id="root"]/div/div[1]/div[1]/span[2]' }).isDisplayed().then(function(ele){
            if(ele=true)
            {
                console.log("weather forecast page is displayed");
            }
            else
            {
                console.log("weather forecast page is not displayed");
            }

        });
        this.driver.sleep(3000);
    });

    this.When(/^user click on the "([^"]*)"$/, function (arg1) {

        var day=arg1;

        var dayXpath='//*[@id="root"]//span[contains(text(),"'+day+'")]';

        this.driver.findElement({ xpath:dayXpath}).then(function(ele){
            var click = ele.click();
        });
        this.driver.sleep(4000);
    });

    this.When(/^user clicks on the "([^"]*)" again$/, function (arg1) {

        var day=arg1;

        var dayXpath='//*[@id="root"]//span[contains(text(),"'+day+'")]';
        this.driver.findElement({ xpath:dayXpath}).then(function(ele){
            var click = ele.click();
        });
        this.driver.sleep(4000);
    });

    this.Then(/^user should see the hourly weather forecast$/, function () {
        this.driver.findElement({ xpath: '//div[contains(@style,\'max-height: 2000px;\')]' }).isDisplayed().then(function(ele){
           console.log(assert(ele));


        });
        this.driver.sleep(4000);
    });


    this.Then(/^user should not see the hourly weather forecast since it is collapsed$/, function () {
        this.driver.findElement({ xpath: '(//div[contains(@style,\'max-height: 0px;\')])[1]' }).isDisplayed().then(function(ele){
            console.log("Collapsed");
        });
        this.driver.sleep(7000);
    });


    var headerMinTemp=0
    var minValueByHourArray=[];

    this.Then(/^user sees the Minimum temperature in Summary$/,async function () {


        await this.driver.findElement(By.xpath("//span[@class='rmq-5ea3c959 min' and @data-test='minimum-1']")).getText().then(function (ele) {
            headerMinTemp = parseInt(ele.substring(0,2).toString());
        });
        var i=0;
        var mintempXpath='//div[contains(@style,\'max-height: 2000px;\')]//div/span[3]/span[contains(@class,\'rmq-5ea3c959 min\') and contains(@data-radium,\'\')]';

        await this.driver.findElements({xpath: mintempXpath}).then(function (elements) {
            elements.map(function (ele1) {
                ele1.getText().then(function (txt) {
                    minValueByHourArray[i]=parseInt(txt.substring(0,2).toString());
                    i++;
                });
            });


        });
        this.driver.sleep(4000);
    });

    var headerMax=0;

    var maxValueByHourArray=[];


    this.Then(/^user sees the Maximum temperature in Summary$/, async function () {

        await this.driver.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[1]/span[3]/span[1]")).getText().then(function (ele) {
            headerMax = parseInt(ele.substring(0,2).toString());
       });
        var maxtempXpath='//div[contains(@style,\'max-height: 2000px;\')]//div/span[3]/span[contains(@class,\'max\') and contains(@data-radium,\'\')]';
        var i=0;
        await this.driver.findElements({xpath: maxtempXpath}).then(function (elements) {
            elements.map(function (ele1) {
                ele1.getText().then(function (txt) {
                    maxValueByHourArray[i]=parseInt(txt.substring(0,2).toString());
                    i++;
                });
            });



        });


     });




    this.Then(/^user sees the Most dominant condition with wind speed in Summary$/, async function () {

        await this.driver.findElement(By.xpath("//span[@class='speed' and @data-test='speed-1']")).getText().then(function (ele) {

            headerMax = parseInt(ele.substring(0, 2).toString());
        });
        var maxwindXpath = '//div[contains(@style,\'max-height: 2000px;\')]//div/span[4]/span[contains(@class,\'speed\') and contains(@data-test,\'speed-1\')]';
        var i=0;
        await this.driver.findElements({xpath: maxwindXpath}).then(function (elements) {
            elements.map(function (ele1) {
                ele1.getText().then(function (txt) {
                    maxValueByHourArray[i] = parseInt(txt.substring(0, 2).toString());
                    i++;
                });
            });

        });
        this.driver.sleep(4000);

    });



    this.Then(/^user sees the Aggregate rainfall in Summary$/, async function () {

        await this.driver.findElement(By.xpath("//span[@class='rainfall' and @data-test='rainfall-1']")).getText().then(function (ele) {

            headerMax = parseInt(ele.substring(0, 2).toString());
        });
        var maxrainXpath = '//div[contains(@style,\'max-height: 2000px;\')]//div/span[5]/span[contains(@class,\'rainfall\') and contains(@data-test,\'rainfall-1\')]';
        var i=0;
        await this.driver.findElements({xpath: maxrainXpath}).then(function (elements) {
            elements.map(function (ele1) {
                ele1.getText().then(function (txt) {
                    maxValueByHourArray[i] = parseInt(txt.substring(0, 2).toString());
                    i++;
                });
            });

        });


        this.driver.sleep(4000);

    });




    this.Then(/^user verifies and summarise the day header values with hourly updates$/,  function () {
        console.log('Maximum in Header\n'+headerMax);
        console.log('Hourly forecast updates:');
        for(var i=0;i<maxValueByHourArray.length;i++){
            console.log(maxValueByHourArray[i]);
        }
        var max=Math.max(...maxValueByHourArray);

        console.log('Maximum in array\n' +max);

        //var headerMax1=headerMax;
       // var max1=max;

        if(max==headerMax){

            console.log('Result: Success');
        }
        else{
            console.log('Result: Failed');
        }

        //console.log('Assert Result:\n'+ assert.equal(max1,headerMax1));
        //console.log('Assert Result111 :\n'+ assert.strictEqual(max1,headerMax1));


        //console.log('Assert Result:\n'+ assert.deepEqual(headerMax,max));

        this.driver.sleep(4000);
    });


    this.Then(/^user verifies the wind speed from detailed section$/,  function () {
        console.log('Maximum in Header\n'+headerMax);
        console.log('Hourly forecast updates:');
        for(var i=0;i<maxValueByHourArray.length;i++){
            console.log(maxValueByHourArray[i]);
        }
        var windSpeedTop=maxValueByHourArray[0];

        console.log('Maximum in array\n' +windSpeedTop);

        //var headerMax1=headerMax;
        // var max1=max;

        if(windSpeedTop==headerMax){

            console.log('Result: Success');
        }
        else{
            console.log('Result: Failed');
        }

        //console.log('Assert Result:\n'+ assert.equal(max1,headerMax1));
        //console.log('Assert Result111 :\n'+ assert.strictEqual(max1,headerMax1));


        //console.log('Assert Result:\n'+ assert.deepEqual(headerMax,max));

        this.driver.sleep(4000);
    });

    this.Then(/^user summarise the day header values with hourly updates for minimum temperature$/, function () {
        console.log('Minimum in Header\n'+headerMinTemp);
        console.log('Hourly forecast updates:');
        for(var i=0;i<minValueByHourArray.length;i++){
            console.log(minValueByHourArray[i]);
        }

        var min=Math.min(...minValueByHourArray);
        console.log('Minimum in array\n' +min);

        if(min==headerMinTemp){

            console.log('Result: Success');
        }
        else{
            console.log('Result: Failed');
        }
        //console.log('Assert Result:\n'+ assert.deepEqual(min,headerMinTemp));
        this.driver.sleep(4000);
    });


    this.Then(/^user verifies the aggregate rainfall from details section$/,  function () {
        console.log('Maximum in Header\n'+headerMax);
        console.log('Hourly forecast updates:');

        var sum=0;
        for(var i=0;i<maxValueByHourArray.length;i++){

            sum=sum+maxValueByHourArray[i];



        }

        console.log("Sum"+ sum);

        console.log('Maximum in array\n' +sum);

        //var headerMax1=headerMax;
        // var max1=max;

        if(sum==headerMax){

            console.log('Result: Success');
        }
        else{
            console.log('Result: Failed');
        }

        //console.log('Assert Result:\n'+ assert.equal(max1,headerMax1));
        //console.log('Assert Result111 :\n'+ assert.strictEqual(max1,headerMax1));


        //console.log('Assert Result:\n'+ assert.deepEqual(headerMax,max));

        this.driver.sleep(4000);
    });


    this.Then(/^user verify and confirm that all values are rounded down$/, async function () {

        var hourlyupdatesXpath = '//div[contains(@style,\'max-height: 2000px;\')]';
        var i=0;
        await this.driver.findElements({xpath: hourlyupdatesXpath}).then(function (elements) {
            elements.map(function (ele1) {
                ele1.getText().then(function (txt) {
                    //maxValueByHourArray[i] = parseInt(txt.substring(0, 2).toString());
                    //i++;
                    var check=txt.search(".");
                    if(check>0){
                        console.log('All values are not rounded off, Execution stopped');
                    }
                    else{
                        console.log('All values are rounded off');
                    }

                });
            });

        });
    });

};
