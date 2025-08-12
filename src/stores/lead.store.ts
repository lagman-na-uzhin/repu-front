// stores/leads.ts
import { API } from "@/shared/api"
import { IConfirmLeadPayload } from "@/shared/api/lead/dto/request-contracts"
import { defineStore } from 'pinia';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  companyName: string;
  createdAt: string;
  assignedManagerId: string | null;
  assignedManagerName: string | null;
}

export interface Manager {
  id: string;
  name: string;
}

export const useLeadStore = defineStore('leads', {
  state: () => ({
    leads: [] as Lead[],
    managers: [] as Manager[], // Доступные менеджеры для назначения
  }),
  actions: {
    async fetchLeads() {
      this.leads = [
        {
          id: '3f2504e0-4f89-41d3-9a0c-0305e82c3302',
          name: 'Иван Иванов',
          phone: '+79001234567',
          email: 'ivan@example.com',
          companyName: 'ООО "Альфа"',
          createdAt: '2025-06-15T10:00:00Z',
          assignedManagerId: 'manager-2',
          assignedManagerName: 'Елена Смирнова',
        },
        {
          id: '3f2504e0-4f89-41d3-9a0c-0305e82c3302',
          name: 'Петр Петров',
          phone: '+79007654321',
          email: 'petr@example.com',
          companyName: 'АО "Бета"',
          createdAt: '2025-06-16T11:30:00Z',
          assignedManagerId: null,
          assignedManagerName: null,
        },
        {
          id: '3f2504e0-4f89-41d3-9a0c-0305e82c3302',
          name: 'Анна Сидорова',
          phone: '+79001112233',
          email: 'anna@example.com',
          companyName: 'ИП "Гамма"',
          createdAt: '2025-06-17T14:00:00Z',
          assignedManagerId: null,
          assignedManagerName: null,
        },
        {
          id: '3f2504e0-4f89-41d3-9a0c-0305e82c3302',
          name: 'Дмитрий Козлов',
          phone: '+79004445566',
          email: 'dmitry@example.com',
          companyName: 'ЗАО "Дельта"',
          createdAt: '2025-06-18T09:15:00Z',
          assignedManagerId: 'manager-1',
          assignedManagerName: 'Мой Менеджер',
        },
      ];

      this.managers = [
        { id: 'manager-1', name: 'Мой Менеджер' },
        { id: 'manager-2', name: 'Елена Смирнова' },
        { id: 'manager-3', name: 'Сергей Павлов' },
      ]
    },
    async assignManager(leadId: string, managerId: string | null, managerName: string | null) {
      const leadIndex = this.leads.findIndex(lead => lead.id === leadId);
      if (leadIndex !== -1) {
        this.leads[leadIndex].assignedManagerId = managerId;
        this.leads[leadIndex].assignedManagerName = managerName;
        console.log(`Lead ${leadId} assigned to manager ${managerName} (${managerId})`);
      }
    },

    async confirmLead(payload: IConfirmLeadPayload) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        await API.LEAD.confirm(payload)
      } catch (error) {
        console.error('Failed to confirm lead in store action:', error)
        throw error
      }
    },

    async calculateTariffPrice(payload: CalculatePricePayload): Promise<number> {
      console.log('Calculating price in store with:', payload);

      return new Promise((resolve) => {
        setTimeout(() => {
          let mockPrice = 0;

          switch (payload.organizationCountRange) {
          case '1-5': mockPrice += 100; break;
          case '5-10': mockPrice += 250; break;
          case '10-50': mockPrice += 500; break;
          case '50+': mockPrice += 1000; break;
          }

          if (payload.tariffType !== 'CUSTOM') {
            const standardTariffs = [
              { id: 'BASIC', basePrice: 100 },
              { id: 'PRO', basePrice: 250 },
              { id: 'PRO_PLUS', basePrice: 500 },
            ];
            const selectedStandard = standardTariffs.find(t => t.id === payload.tariffType);
            if (selectedStandard) {
              mockPrice += selectedStandard.basePrice;
            }
          }

          // Add prices for active features (mock)
          if (payload.features.companyDataSync) mockPrice += 100;
          if (payload.features.multiAccess) mockPrice += 30;
          if (payload.features.reviewAutoReply) mockPrice += 50;
          if (payload.features.analysisReview) mockPrice += 75;
          if (payload.features.registerPlacement) mockPrice += 20;
          if (payload.features.reviewReply) mockPrice += 10;
          if (payload.features.reviewComplaint) mockPrice += 15;
          if (payload.features.reviewAutoComplaint) mockPrice += 25;
          if (payload.features.analysisByRadius) mockPrice += 40;
          if (payload.features.analysisCompetitor) mockPrice += 60;

          mockPrice = Math.round(mockPrice * (1 + (Math.random() * 0.1 - 0.05))); // +/- 5% variation

          console.log(`Calculated mock price for ${payload.tariffType}: $${mockPrice}`);
          resolve(mockPrice);
        }, 300); // Simulate network delay
      });
    },
  },
});
