import * as React from 'react';
import { Link } from 'react-router-dom';
import { ITEMS } from '../const/MenuItem';


export const Sidebar = () => (
  <div className="sidebar">
    <ul className="sidebar-nav">
      {
        ITEMS.map((item) => {
          return (
            <li key={item.id}>
              <Link to={item.url}>
                <i className={item.className} /> {item.text}
              </Link>
          </li>
          );
        })
      }
    </ul>
  </div>
);
