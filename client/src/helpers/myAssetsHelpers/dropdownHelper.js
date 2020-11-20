export default function toggleDropdown(e, tableRef) {
  e.preventDefault();
  const table = tableRef.current.style;
  const button = e.target.classList;
  if (table?.display === '' || table?.display === 'none') {
    table.display = 'block';
    table.animation = 'growDown 300ms ease-in-out forwards';
    button.add('dropdown-active');
    button.remove('dropdown');
  } else {
    table.animation = 'shrinkUp 300ms ease-in-out forwards';
    setTimeout(() => table.display = 'none', 300);
    button.remove('dropdown-active');
    button.add('dropdown');
  }
}