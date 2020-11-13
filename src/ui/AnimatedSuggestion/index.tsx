/* eslint-disable no-undef */
import React from 'react';
import './index.scss';

interface AnimatedSuggestionProps {
  children: JSX.Element | JSX.Element[];
  shown: boolean;
}

const AnimatedSuggestion: React.FC<AnimatedSuggestionProps> = (props: AnimatedSuggestionProps) => (
  <div className={`animated-suggestion ${props.shown ? 'animated-suggestion--shown' : ''}`}>
    {props.children}
  </div>
);

export default React.memo(AnimatedSuggestion);
