/**
 * @license AGPL-3.0-only
 * Data Visualization - A Data Visualization Compendium
 * Copyright (C) 2024 Eldar Pashazade <eldarlrd@pm.me>
 *
 * This file is part of Data Visualization.
 *
 * Data Visualization is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * Data Visualization is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Data Visualization. If not, see <https://www.gnu.org/licenses/>.
 */

import 'bootstrap/scss/bootstrap.scss';

import { Header } from '@/banners/header.ts';

const root = document.getElementById('root');

if (root)
  root.innerHTML = `
    ${Header()}
  `;

// Easter Egg
console.log(
  '"There are lies, damned lies, and statistics." - Benjamin Disraeli'
);
