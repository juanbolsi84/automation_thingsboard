import { test } from '../Utilities/Fixtures.js';
import { expect } from '@playwright/test';
import PomManager from '../Pages/PomManager.js';
import ApiUtil from '../Utilities/ApiUtil.js';
import MockUtil from '../Utilities/MockUtil.js';
import { readCsvFile } from '../Utilities/ReadCsvFile.js';
const dashboardData = require('../Data/DashboardData.json');


test('Create and assign customer to dashboard', async ({page}) => {
    
})