import { useState } from "react";

function TreeNode({ node, onSelect, onSubchildSelect }) {
  const [isSelected, setIsSelected] = useState(false);

  const handleSelect = () => {
    setIsSelected(!isSelected);
    onSelect(node.name, !isSelected);
    if (!isSelected) {
      onSubchildSelect(node.name, true);
    }
  };

  const handleSubchildSelect = (name, isSelected) => {
    onSubchildSelect(name, isSelected);
    if (!isSelected) {
      setIsSelected(false);
    }
  };

  return (
    <div>
      <input type="checkbox" checked={isSelected} onChange={handleSelect} />
      {node.name}
      {node.subcategories && isSelected && (
        <div style={{ marginLeft: "20px" }}>
          {node.subcategories.map((subnode, index) => (
            <TreeNode
              key={index}
              node={subnode}
              onSelect={onSelect}
              onSubchildSelect={handleSubchildSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeView({ data, handleSelect }) {
  const [selectedItems, setSelectedItems] = useState({});

  //   const handleChildSelect = (name, isSelected) => {
  //     setSelectedItems({
  //       ...selectedItems,
  //       [name]: isSelected,
  //     });
  //   };

  const handleSubchildSelect = (name, isSelected) => {
    const updatedSelectedItems = { ...selectedItems, [name]: isSelected };

    // Check if all subchildren of a parent are selected
    data.forEach((parentNode) => {
      if (
        parentNode.subcategories &&
        parentNode.subcategories.every(
          (subnode) => updatedSelectedItems[subnode.name],
        )
      ) {
        updatedSelectedItems[parentNode.name] = true;
      } else {
        updatedSelectedItems[parentNode.name] = false;
      }
    });

    setSelectedItems(updatedSelectedItems);
  };

  const handleParentSelect = (name, isSelected) => {
    const updatedSelectedItems = {
      ...selectedItems,
      [name]: isSelected,
    };
    if (isSelected) {
      data.forEach((parentNode) => {
        if (parentNode.name === name) {
          parentNode.subcategories.forEach((subnode) => {
            updatedSelectedItems[subnode.name] = true;
          });
        }
      });
    }
    setSelectedItems(updatedSelectedItems);
  };

  return (
    <form>
      {data.map((node, index) => (
        <TreeNode
          key={index}
          node={node}
          onSelect={handleParentSelect}
          onSubchildSelect={handleSubchildSelect}
        />
      ))}
      <button type="submit" onClick={() => handleSelect(selectedItems)}>
        Submit
      </button>
    </form>
  );
}

export function HandleSelect({ onSelect }) {
  return (
    <div>
      <button type="submit" onClick={onSelect}>
        Handle Select
      </button>
    </div>
  );
}
