// src/SubgroupList.js
import React, { useState, useEffect } from "react";
import { getSubgroups } from "../services/sparqlService";

const SubgroupList = ({ group }) => {
  const [subgroups, setSubgroups] = useState([]);

  useEffect(() => {
    if (!group) return;

    const fetchSubgroups = async () => {
      const subgroupsData = await getSubgroups(group);
      setSubgroups(
        subgroupsData.map((binding) => ({
          subgroup: binding.subgroup.value,
          label: binding.label.value,
        }))
      );
    };

    fetchSubgroups();
  }, [group]);

  return (
    <div>
      <h3>Subgroups</h3>
      <ul>
        {subgroups.map((subgroup) => (
          <li key={subgroup.subgroup}>{subgroup.label}</li>
        ))}
      </ul>
    </div>
  );
};

export default SubgroupList;
