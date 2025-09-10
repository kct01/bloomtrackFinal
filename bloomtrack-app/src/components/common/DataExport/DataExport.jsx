import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { useInAppNotifications } from '../../../context/NotificationContext';
import Button from '../Button';
import styles from './DataExport.module.css';

function DataExport() {
  const { user, pregnancyData } = useApp();
  const { addNotification } = useInAppNotifications();
  const [exportFormat, setExportFormat] = useState('json');
  const [selectedData, setSelectedData] = useState({
    profile: true,
    pregnancy: true,
    milestones: true,
    journal: true,
    calendar: true,
    photos: false // Photos can be large
  });
  const [isExporting, setIsExporting] = useState(false);

  // Get all data from localStorage
  const getAllUserData = () => {
    const data = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        appVersion: '1.0.0',
        dataVersion: '1.0'
      }
    };

    if (selectedData.profile) {
      data.profile = {
        user: user,
        preferences: JSON.parse(localStorage.getItem('bloomtrack_app_preferences') || '{}')
      };
    }

    if (selectedData.pregnancy) {
      data.pregnancy = {
        pregnancyData: pregnancyData,
        calculations: {
          currentWeek: pregnancyData.currentWeek,
          trimester: pregnancyData.trimester,
          daysUntilDue: pregnancyData.daysUntilDue || 0,
          progressPercentage: Math.min(100, (pregnancyData.currentWeek / 40) * 100)
        }
      };
    }

    if (selectedData.milestones) {
      data.milestones = JSON.parse(localStorage.getItem('bloomtrack_milestones') || '[]');
    }

    if (selectedData.journal) {
      data.journal = JSON.parse(localStorage.getItem('bloomtrack_journal_entries') || '[]');
    }

    if (selectedData.calendar) {
      data.calendar = {
        appointments: JSON.parse(localStorage.getItem('bloomtrack_appointments') || '[]'),
        events: JSON.parse(localStorage.getItem('bloomtrack_calendar_events') || '[]'),
        moodEntries: JSON.parse(localStorage.getItem('bloomtrack_mood_entries') || '[]')
      };
    }

    if (selectedData.photos && user.profilePicture) {
      data.photos = {
        profilePicture: user.profilePicture
      };
    }

    return data;
  };

  // Convert data to CSV format
  const convertToCSV = (data) => {
    let csvContent = '';
    
    // Add header information
    csvContent += `BloomTrack Data Export\n`;
    csvContent += `Export Date,${new Date().toLocaleDateString()}\n`;
    csvContent += `\n`;

    // Profile Information
    if (data.profile) {
      csvContent += `PROFILE INFORMATION\n`;
      csvContent += `Name,${data.profile.user.name || 'Not set'}\n`;
      csvContent += `Email,${data.profile.user.email || 'Not set'}\n`;
      csvContent += `\n`;
    }

    // Pregnancy Information
    if (data.pregnancy) {
      csvContent += `PREGNANCY INFORMATION\n`;
      csvContent += `Due Date,${data.pregnancy.pregnancyData.dueDate || 'Not set'}\n`;
      csvContent += `Current Week,${data.pregnancy.pregnancyData.currentWeek || 0}\n`;
      csvContent += `Trimester,${data.pregnancy.pregnancyData.trimester || 1}\n`;
      csvContent += `Baby Name,${data.pregnancy.pregnancyData.babyDetails?.name || 'Little One'}\n`;
      csvContent += `Baby Gender,${data.pregnancy.pregnancyData.babyDetails?.gender || 'Surprise'}\n`;
      csvContent += `\n`;
    }

    // Milestones
    if (data.milestones && data.milestones.length > 0) {
      csvContent += `MILESTONES\n`;
      csvContent += `Date,Week,Title,Description\n`;
      data.milestones.forEach(milestone => {
        csvContent += `${milestone.date || ''},${milestone.week || ''},${milestone.title || ''},${milestone.description || ''}\n`;
      });
      csvContent += `\n`;
    }

    // Journal Entries
    if (data.journal && data.journal.length > 0) {
      csvContent += `JOURNAL ENTRIES\n`;
      csvContent += `Date,Mood,Title,Content\n`;
      data.journal.forEach(entry => {
        const content = (entry.content || '').replace(/,/g, ';').replace(/\n/g, ' ');
        csvContent += `${entry.date || ''},${entry.mood || ''},${entry.title || ''},${content}\n`;
      });
      csvContent += `\n`;
    }

    return csvContent;
  };

  // Generate summary report
  const generateSummaryReport = (data) => {
    const report = {
      title: 'BloomTrack Pregnancy Journey Summary',
      exportDate: new Date().toLocaleDateString(),
      sections: []
    };

    if (data.profile) {
      report.sections.push({
        title: 'Your Profile',
        content: [
          `Name: ${data.profile.user.name || 'Beautiful Mama'}`,
          `Email: ${data.profile.user.email || 'Not provided'}`,
          `Profile completed on: ${new Date().toLocaleDateString()}`
        ]
      });
    }

    if (data.pregnancy) {
      const pg = data.pregnancy.pregnancyData;
      const calc = data.pregnancy.calculations;
      
      report.sections.push({
        title: 'Pregnancy Journey',
        content: [
          `Due Date: ${pg.dueDate ? new Date(pg.dueDate).toLocaleDateString() : 'Not set'}`,
          `Current Progress: Week ${pg.currentWeek} of 40 (${Math.round(calc.progressPercentage)}% complete)`,
          `Current Trimester: ${pg.trimester}`,
          `Baby's Name: ${pg.babyDetails?.name || 'Little One'}`,
          `Gender: ${pg.babyDetails?.gender || 'Surprise'}`,
          `Days until due date: ${calc.daysUntilDue}`
        ]
      });
    }

    if (data.milestones && data.milestones.length > 0) {
      report.sections.push({
        title: 'Milestones Achieved',
        content: [
          `Total milestones: ${data.milestones.length}`,
          ...data.milestones.slice(0, 5).map(m => `• ${m.title} (Week ${m.week})`)
        ]
      });
    }

    if (data.journal && data.journal.length > 0) {
      report.sections.push({
        title: 'Journal Summary',
        content: [
          `Total journal entries: ${data.journal.length}`,
          `Date range: ${data.journal[data.journal.length - 1]?.date} to ${data.journal[0]?.date}`,
          'Recent entries:',
          ...data.journal.slice(0, 3).map(entry => `• ${entry.title} (${entry.date})`)
        ]
      });
    }

    return report;
  };

  // Download file function
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const userData = getAllUserData();
      const timestamp = new Date().toISOString().split('T')[0];
      
      switch (exportFormat) {
        case 'json':
          downloadFile(
            JSON.stringify(userData, null, 2),
            `bloomtrack-data-${timestamp}.json`,
            'application/json'
          );
          break;
          
        case 'csv':
          downloadFile(
            convertToCSV(userData),
            `bloomtrack-data-${timestamp}.csv`,
            'text/csv'
          );
          break;
          
        case 'summary':
          const report = generateSummaryReport(userData);
          let summaryContent = `${report.title}\n`;
          summaryContent += `Export Date: ${report.exportDate}\n\n`;
          
          report.sections.forEach(section => {
            summaryContent += `${section.title.toUpperCase()}\n`;
            summaryContent += section.content.join('\n');
            summaryContent += '\n\n';
          });
          
          downloadFile(
            summaryContent,
            `bloomtrack-summary-${timestamp}.txt`,
            'text/plain'
          );
          break;
      }

      addNotification({
        type: 'success',
        title: '📥 Data Exported Successfully!',
        message: `Your pregnancy data has been exported as ${exportFormat.toUpperCase()} format.`
      });

    } catch (error) {
      console.error('Export error:', error);
      addNotification({
        type: 'error',
        title: '❌ Export Failed',
        message: 'There was an error exporting your data. Please try again.'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDataToggle = (dataType) => {
    setSelectedData(prev => ({
      ...prev,
      [dataType]: !prev[dataType]
    }));
  };

  // Calculate estimated file size
  const getEstimatedSize = () => {
    const userData = getAllUserData();
    const jsonSize = JSON.stringify(userData).length;
    const sizeKB = Math.ceil(jsonSize / 1024);
    return sizeKB < 1024 ? `${sizeKB} KB` : `${(sizeKB / 1024).toFixed(1)} MB`;
  };

  return (
    <div className={styles.dataExport}>
      <div className={styles.header}>
        <h3>📊 Data & Export</h3>
        <p className={styles.description}>
          Export your pregnancy journey data for backup, sharing, or personal records.
        </p>
      </div>

      {/* Export Format Selection */}
      <div className={styles.section}>
        <h4>📋 Export Format</h4>
        <div className={styles.formatOptions}>
          <label className={styles.formatOption}>
            <input
              type="radio"
              name="format"
              value="json"
              checked={exportFormat === 'json'}
              onChange={(e) => setExportFormat(e.target.value)}
            />
            <div className={styles.formatInfo}>
              <strong>JSON - Complete Data</strong>
              <p>Full data export with all details, perfect for backup or transferring to another device.</p>
            </div>
          </label>

          <label className={styles.formatOption}>
            <input
              type="radio"
              name="format"
              value="csv"
              checked={exportFormat === 'csv'}
              onChange={(e) => setExportFormat(e.target.value)}
            />
            <div className={styles.formatInfo}>
              <strong>CSV - Spreadsheet Format</strong>
              <p>Data organized in tables, perfect for opening in Excel or Google Sheets.</p>
            </div>
          </label>

          <label className={styles.formatOption}>
            <input
              type="radio"
              name="format"
              value="summary"
              checked={exportFormat === 'summary'}
              onChange={(e) => setExportFormat(e.target.value)}
            />
            <div className={styles.formatInfo}>
              <strong>Summary Report</strong>
              <p>Human-readable summary of your pregnancy journey, perfect for sharing or printing.</p>
            </div>
          </label>
        </div>
      </div>

      {/* Data Selection */}
      <div className={styles.section}>
        <h4>📋 What to Include</h4>
        <div className={styles.dataOptions}>
          <label className={styles.dataOption}>
            <input
              type="checkbox"
              checked={selectedData.profile}
              onChange={() => handleDataToggle('profile')}
            />
            <span>👤 Profile Information (Name, email, preferences)</span>
          </label>

          <label className={styles.dataOption}>
            <input
              type="checkbox"
              checked={selectedData.pregnancy}
              onChange={() => handleDataToggle('pregnancy')}
            />
            <span>🤰 Pregnancy Data (Due date, current week, baby details)</span>
          </label>

          <label className={styles.dataOption}>
            <input
              type="checkbox"
              checked={selectedData.milestones}
              onChange={() => handleDataToggle('milestones')}
            />
            <span>🎉 Milestones & Achievements</span>
          </label>

          <label className={styles.dataOption}>
            <input
              type="checkbox"
              checked={selectedData.journal}
              onChange={() => handleDataToggle('journal')}
            />
            <span>📝 Journal Entries</span>
          </label>

          <label className={styles.dataOption}>
            <input
              type="checkbox"
              checked={selectedData.calendar}
              onChange={() => handleDataToggle('calendar')}
            />
            <span>📅 Calendar Events & Appointments</span>
          </label>

          <label className={styles.dataOption}>
            <input
              type="checkbox"
              checked={selectedData.photos}
              onChange={() => handleDataToggle('photos')}
            />
            <span>📸 Photos (Profile picture)</span>
          </label>
        </div>
      </div>

      {/* Export Info */}
      <div className={styles.exportInfo}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Estimated Size:</span>
          <span className={styles.infoValue}>{getEstimatedSize()}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Export Date:</span>
          <span className={styles.infoValue}>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Export Actions */}
      <div className={styles.actions}>
        <Button
          variant="gentle"
          size="medium"
          onClick={handleExport}
          disabled={isExporting || Object.values(selectedData).every(v => !v)}
          className={styles.exportButton}
        >
          {isExporting ? '⏳ Exporting...' : '📥 Export Data'}
        </Button>
        
        <p className={styles.note}>
          💡 Your data is stored locally and private. Export files contain only the data you select above.
        </p>
      </div>
    </div>
  );
}

export default DataExport;