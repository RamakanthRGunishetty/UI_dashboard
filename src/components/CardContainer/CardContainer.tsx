import ListItem from "../ListItem";

interface CardContainerProps {
  subHeader: string;
  list: ListItem[];
}

const CardContainer = ({ subHeader, list }: CardContainerProps) => {
    
  return (
    <div className="card-list-wrapper">
      <p>{subHeader}</p>
      <div className="content">
        {list.map((listItem, index) => (
          <ListItem {...listItem} key={index} />
        ))}
      </div>
    </div>
  );
  
};

export default CardContainer;
