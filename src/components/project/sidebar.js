// sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { elastic as Menu } from 'react-burger-menu';

export default props => {
    const linkTarget = {
        pathname: "/playlist",
        key: Math.random(), // we could use Math.random, but that's not guaranteed unique.
    }

    return (
            <Menu {...props}  isOpen={ false } noOverlay >
            <Link to={'/'}>
                <p className="menu-item" >Projects</p>
            </ Link>
            <Link to={linkTarget} onClick={() => (window.location.href.includes('playlist'))? window.location.reload():''}>
                <p className="menu-item" >Playlist</p>
            </Link>
        </Menu>
    );
};