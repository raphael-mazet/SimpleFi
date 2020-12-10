import React, {useRef} from 'react';
import './SummaryBox.css';
import DropdownButton from '../DropdownButton/DropdownButton';
import SummaryTable from '../SummaryTable/SummaryTable';
import helpers from '../../helpers';

export default function SummaryBox({userValues, headers, tableName, currencyCells, setCurrentDetail}) {
  const holdingTable = useRef(null);
  const farmingTable = useRef(null);
  const earningTable = useRef(null);

  function getRef(tableName){
    if (tableName === 'holding') return holdingTable;
    if (tableName === 'farming') return farmingTable;
    if (tableName === 'earning') return earningTable;
  }

  return (
    <>
      <div className="container-header">
        <h2>{tableName.charAt(0).toUpperCase() + tableName.slice(1)}</h2>
        <div className="container-header-data">
          <h3 className={`header-total-${tableName}`}>{`${userValues.length} ${tableName === 'holding' ? 'tokens' : 'investments'}`}</h3>
          <h3 className="header-performance">+20%</h3>
          <h3 className="header-locked">15% locked</h3>
        </div>
        <div className="dropdown-button-wrapper">
          <DropdownButton handleDropdown={helpers.toggleDropdown} tableRef={getRef(tableName)}/>
        </div>
      </div>
      <div ref={getRef(tableName)} className="summary-table-container">
        <SummaryTable headers={headers} userValues={userValues} tableName={tableName} currencyCells={currencyCells} setCurrentDetail={setCurrentDetail}/>
      </div>
    </>
  )
}

