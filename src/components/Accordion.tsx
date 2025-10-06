import { useState } from "react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
  <div className="product-info-accordion">
    <div className="accordion">
      <button className="accordion__button" onClick={() => setIsOpen(!isOpen)}>
        {title}
        <span>{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && <div className="accordion__content">{children}</div>}
    </div>
  </div>
);
};

export default Accordion;
