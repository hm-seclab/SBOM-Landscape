<script setup>
import {onBeforeMount, reactive, ref, watch} from "vue";
import TreePlot from "./components/plots/tree-plot.vue";
import ListPlot from "./components/plots/list-plot.vue";
import axios from "axios";
import {load} from "js-yaml";
import draggable from 'vuedraggable'
import {aggregateList, generateTreeObject, normaliseList} from "./global/global.js";
import MarkdownParser from "./components/markdownParser.vue";
import CirclePlot from "./components/plots/circle-plot.vue";
import DetailEnumeration from "./components/detail-enumeration.vue";

const activeView = ref(1)
const activeMode = ref('normalize')
const filters = reactive([])

const rawdata = ref([])
const formattedData = ref([])
const filteredTreeData = ref()

const selectedItem= ref('HowTo')

onBeforeMount(() => {
  axios.get('/filters.yaml').then(x => {
    load(x.data).forEach(filter => filters.push(filter));
  })
  axios.get('/data.yaml').then(x => {
    rawdata.value = load(x.data)
  })
})

function onViewChange(view) {
  activeView.value = view
}

function onModeChange(mode) {
  activeMode.value = mode
  recalculateAllData(filters, rawdata.value)
}

const updateFilters = (event) => {
  const movedItem = filters.splice(event.oldIndex, 1)[0];
  filters.splice(event.newIndex, 0, movedItem);
};

function recalculateAllData(currentFilters, currentRawData) {
  if (activeMode.value === 'normalize') {
    formattedData.value = normaliseList(currentRawData)
  } else {
    formattedData.value = aggregateList(currentRawData)
  }
  filteredTreeData.value = generateTreeObject(currentFilters, formattedData.value)
}

watch(rawdata, (newRawData, oldRawData) => {
  recalculateAllData(filters, newRawData)
})

watch(filters, (newFilters, oldFilters) => {
  recalculateAllData(newFilters, rawdata.value)
})

</script>

<template>
  <div class="flex overflow-hidden grid max-h-full m-0">
    <div class="flex-column flex col-2 surface-50 full-vue-heigth shadow-right scrollable-div">
      <span class="p-buttonset mb-2 w-full">
        <p-button label="Circle" rounded :outlined="activeView !== 1" :severity="activeView === 1 ? '' : 'secondary'" @click="onViewChange(1)" class="w-4"/>
        <p-button label="Tree" rounded :outlined="activeView !== 2" :severity="activeView === 2 ? '' : 'secondary'" @click="onViewChange(2)" class="w-4"/>
        <p-button label="List" rounded :outlined="activeView !== 3" :severity="activeView === 3 ? '' : 'secondary'" @click="onViewChange(3)" class="w-4"/>
      </span>

      <span class="p-buttonset w-full">
        <p-button label="Normalize" rounded :outlined="activeMode !== 'normalize'"
                  :severity="activeMode === 'normalize' ? '' : 'secondary'"
                  @click="onModeChange('normalize')" class="w-6"
                  v-tooltip="{ value: 'This mode displays each entry in its original form, without any grouping. This means that an entry can appear multiple times if it belongs to multiple categories. This is useful when you want to see all instances of an entry, regardless of its category.', showDelay: 750, hideDelay: 300 }"/>
        <p-button label="Aggregate" rounded :outlined="activeMode !== 'aggregate'"
                  :severity="activeMode === 'aggregate' ? '' : 'secondary'"
                  @click="onModeChange('aggregate')" class="w-6"
                  v-tooltip="{ value: 'This mode groups entries by their categories to reduce duplication. If an entry belongs to multiple categories, it will only be displayed once, under a group that represents those categories. This is useful when you want a simplified view of the data, without repeated entries.', showDelay: 750, hideDelay: 300 }"/>
      </span>

      <p-divider/>

      <draggable v-model="filters" @end="updateFilters" itemKey="name">
        <template #item="{element}">
          <div class='flex p-2 mb-2 justify-content-between not-draggable card w-full surface-200 cursor-move'>
            <h2 class="card-title">{{ element.name }}</h2>
            <div class="flex align-items-center">
              <p-button v-tooltip="{ value: element.description, showDelay: 300, hideDelay: 300 }" text rounded icon="pi pi-question-circle" severity="secondary"/>
              <p-inputSwitch v-model="element.enabled"/>
            </div>
          </div>
        </template>
      </draggable>

      <div style="margin-top: auto">
        <a href="https://gitlab.com/Mariuxdeangelo/sbom-landscape/" target="_blank">
          <p-button label="Contribute on GitHub" icon="pi pi-github"
                    rounded outlined severity="secondary" class="w-full"/>
        </a>
      </div>
    </div>
    <div id="workbench" class="flex-grow-1 flex col full-vue-heigth">

      <div v-if="filteredTreeData" class="flex-grow-1 flex col full-vue-heigth">
<!--        <network-plot v-else-if="activeView === 1" :data="rawdata" v-model:selected-item="selectedItem"/>-->
        <circle-plot v-if="activeView === 1" :data="filteredTreeData" v-model:selected-item="selectedItem"/>
        <tree-plot v-else-if="activeView === 2" :data="filteredTreeData" v-model:selected-item="selectedItem"/>
        <list-plot v-else-if="activeView === 3" :data="rawdata" :filters="filters" v-model:selected-item="selectedItem"/>
      </div>
    </div>

    <div class="flex flex-column surface-50 col-2 full-vue-heigth shadow-left">
      <div class="flex justify-content-between align-items-center m-2">
        <h2 class="m-0">{{ selectedItem }}</h2>
        <img :src="'logos/' + selectedItem + '.png'" style="display: none"
             @error="event => event.target.style.display = 'none'"
             @load="event => event.target.style.display = 'block'"
             :alt="selectedItem"
             class="responsive-image p-1"/>
      </div>
      <p-divider class="mt-2"/>
      <div class="scrollable-div">
        <detail-enumeration :selected="selectedItem" :rawdata="rawdata"/>
        <markdown-parser :selected="selectedItem"/>
      </div>
    </div>
  </div>

</template>

<style scoped>
.full-vue-heigth {
  height: 100vh;
  position: relative;
  padding: 8px;
}

.not-draggable {
  cursor: no-drop;
}

.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.card-title {
  font-size: 1.25em;
  font-weight: bold;
}
</style>
