;(function() {
  locAddNamespace('units');
  model.ecoData = ko.observable({})
  unitInfoParser.loadUnitData(function(data) {
    var nameMap = {}
    for (var id in data) {
      nameMap[data[id].name] = data[id]
    }
    model.ecoData(nameMap)
  }, function(spec) {
    var net = {
      name: loc(spec.display_name),
      metal: 0,
      energy: 0,
    }
    if (spec.production) {
      if (spec.production.metal) {
        net.metal = net.metal + spec.production.metal
      }
      if (spec.production.energy) {
        net.energy = net.energy + spec.production.energy
      }
    }
    if (spec.consumption) {
      if (spec.consumption.metal) {
        net.metal = net.metal - spec.consumption.metal
      }
      if (spec.consumption.energy) {
        net.energy = net.energy - spec.consumption.energy
      }
    }
    if (spec.teleporter) {
      if (spec.teleporter.energy_demand) {
        net.energy = net.energy - spec.teleporter.energy_demand
      }
    }
    return net
  }, function(a, b) {
    return {
      name: a.name,
      metal: a.metal + b.metal,
      energy: a.energy + b.energy,
    }
  })


  model.netMetal = ko.computed(function() {
    var eco = model.ecoData()[model.name()]
    if (eco) {
      if (eco.metal > 0) {
        return '+' + eco.metal.toString()
      } else if (eco.metal < 0) {
        return eco.metal.toString()
      }
    }
  })
  model.netEnergy = ko.computed(function() {
    var eco = model.ecoData()[model.name()]
    if (eco) {
      if (eco.energy > 0) {
        return '+' + eco.energy.toString()
      } else if (eco.energy < 0) {
        return eco.energy.toString()
      }
    }
  })

  $('.resources').append(
    '<div class="stat net_metal stat_num" data-bind="visible: netMetal, text: netMetal"></div>' +
    '<div class="stat net_energy stat_num" data-bind="visible: netEnergy, text: netEnergy"></div>')


})()
