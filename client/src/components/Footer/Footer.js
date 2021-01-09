import React from 'react';
import './Footer.css';

export default function Footer () {
  return (
    <footer>
      <span>© {new Date().getFullYear()} SimpleFi</span>
      <span>·</span>
      <a href="https://twitter.com/simplefi_" target="_blank" rel="noreferrer">Twitter</a>
    </footer>
  )
}