import React from 'react';
import './index.scss';

interface ErrorMessageProps {
  error: string;
  action: string;
  onClick?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = (props: ErrorMessageProps) => (
  <div className="error-message">
    <h2 className="error-message__title">Oops... {props.error}</h2>
    {props.action && props.onClick && (
      <h1 className="error-message__action" onClick={props.onClick}>
        {props.action}
      </h1>
    )}
  </div>
);

export default React.memo(ErrorMessage);
