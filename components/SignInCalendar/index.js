// components/SignInCalendar/index.js
Component({
  properties: {
    signedDates: {
      type: Array,
      value: []
    },
    makeUpCount: {
      type: Number,
      value: 0
    }
  },

  data: {
    weekLabels: ['日', '一', '二', '三', '四', '五', '六'],
    days: [],
    currentMonth: ''
  },

  lifetimes: {
    attached() {
      this.initCalendar();
    }
  },

  observers: {
    signedDates() {
      this.initCalendar();
    }
  },

  methods: {
    initCalendar() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const currentMonth = `${year}-${String(month).padStart(2, '0')}`;
      
      const daysInMonth = new Date(year, month, 0).getDate();
      const firstDayWeekday = new Date(year, month - 1, 1).getDay();
      
      const days = [];
      const today = `${year}-${String(month).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      // 空白填充
      for (let i = 0; i < firstDayWeekday; i++) {
        days.push({ day: 0, date: '', status: 'empty' });
      }
      
      // 日期填充
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isSigned = this.data.signedDates.includes(dateStr);
        const isFuture = dateStr > today;
        const isMissed = !isSigned && !isFuture;
        
        days.push({
          day,
          date: dateStr,
          status: isSigned ? 'signed' : isFuture ? 'future' : 'missed'
        });
      }
      
      this.setData({
        days,
        currentMonth: `${year}年${month}月`
      });
    },

    onDayTap(e) {
      const { day, date, status } = e.currentTarget.dataset;
      
      if (status === 'missed' && this.data.makeUpCount > 0) {
        this.triggerEvent('makeUp', { date });
      }
    }
  }
});
