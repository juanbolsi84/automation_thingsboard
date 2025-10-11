import HomePage from "./HomePage.js";
import LoginPage from "./Login.js";
import Devices from "./Devices.js";
import Assets from "./Assets.js";
import Customers from "./Customers.js";
import ImageGallery from "./ImageGallery.js";
import Dashboards from "./Dashboards.js"

export default class PomManager{
    constructor(page){
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.homePage = new HomePage(page);
    this.devices = new Devices(page);
    this.assets = new Assets(page);
    this.customers = new Customers(page);
    this.imageGallery = new ImageGallery(page);
    this.dashboards = new Dashboards(page);
    }
}