const chartCallbacks = 
{
  title: {
    farming: function(tooltipItem, data) {
      return data.datasets[0].labels[tooltipItem[0].index]
    },
    earningAndFarming: function(tooltipItem, data) {
      return data.datasets[0].other[tooltipItem[0].index].title;
    }
  },

  beforeBody: {
    earningAndFarming: function(tooltipItem, data) {
      return data.datasets[0].other[tooltipItem[0].index].beforeBody;
    }
  },

  label: {
    farming: function(tooltipItem, data) {
      return ` $${data.datasets[0].data[tooltipItem.index]} (${data.datasets[0].other[tooltipItem.index]})` ;
    },
    earningAndFarming: function(tooltipItem, data) {
      return ` $${(data.datasets[0].data[tooltipItem.index]).toLocaleString()}` ;
    }
  },
}

export default chartCallbacks;