import React, {useRef, useState, useEffect} from 'react';
import './SummaryBox.css';
import DropdownButton from '../DropdownButton/DropdownButton';
import SummaryTable from '../SummaryTable/SummaryTable';
import helpers from '../../helpers';

export default function SummaryBox({headlines, userValues, headers, tableName, currencyCells, setCurrentDetail, allLoaded}) {
  const [valueDisplay, setValueDisplay] = useState(false)
  const holdingTable = useRef(null);
  const farmingTable = useRef(null);
  const earningTable = useRef(null);
  const [boxHeadlines, setBoxHeadlines] = useState({formattedHeadlines: [], perfClasses: []});


  useEffect(() => {
    if (userValues.length) {
      setValueDisplay(true);
    }
  }, [userValues])

  useEffect(() => {
    setBoxHeadlines(helpers.formatHeadlines(tableName, headlines));
  }, [headlines, tableName]);

  function getRef(tableName){
    if (tableName === 'holding') return holdingTable;
    if (tableName === 'farming') return farmingTable;
    if (tableName === 'earning') return earningTable;
  }

  return (
    <>
      <div className="box-container-headline">
        <h2>{tableName.charAt(0).toUpperCase() + tableName.slice(1)}</h2>
        <div className="container-headline-data-loading" style={!allLoaded ? {display: 'flex'} : {display: 'none'}}>
          <h3>Loading...</h3>
        </div>
        <div className="container-headline-data" style={allLoaded ? {display: 'flex'} : {display: 'none'}}>
          {valueDisplay ?
          <> 
            <h3 className={`headline-total-${tableName}`}>{`${userValues.length} ${tableName === 'holding' ? 'tokens' : 'investments'}`}</h3>
            {boxHeadlines.formattedHeadlines.map((headline, index) => (
              //FIXME: headline should never come back with a NaN or require the includes/replace hack below
              <h3 key={`${tableName}-headline-${index}`} className={boxHeadlines.perfClasses[index] ? `headline-performance-${boxHeadlines.perfClasses[index]}` : "headline"}>{!headline.includes('NaN') ? headline : headline.replace('NaN', '0')}</h3>
            ))}
          </>
          : <h3>You currently have no {tableName === 'holding' ? 'assets' : 'investments'}</h3>
          }
        </div>
        <div className="dropdown-button-wrapper" style={valueDisplay ? {display: 'flex'} : {display: 'none'}}>
          <DropdownButton handleDropdown={helpers.toggleDropdown} tableRef={getRef(tableName)}/>
        </div>
      </div>
      <div ref={getRef(tableName)} className="summary-table-container">
        <SummaryTable headers={headers} userValues={userValues} tableName={tableName} currencyCells={currencyCells} setCurrentDetail={setCurrentDetail}/>
      </div>
    </>
  )
}

