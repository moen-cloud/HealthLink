const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { sendAppointmentReminder } = require('./emailService');

// Initialize all cron jobs
function initializeCronJobs() {
  console.log('🕐 Initializing scheduled tasks...');

  // Send appointment reminders every day at 8 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('📧 Running appointment reminder task...');
    await sendDailyAppointmentReminders();
  });

  // Clean up old data every week (Sunday at 3 AM)
  cron.schedule('0 3 * * 0', async () => {
    console.log('🗑️  Running data cleanup task...');
    await cleanupOldData();
  });

  // Generate daily health reports (every day at 6 AM)
  cron.schedule('0 6 * * *', async () => {
    console.log('📊 Generating daily health reports...');
    await generateDailyReports();
  });

  // Database backup (every day at 2 AM)
  cron.schedule('0 2 * * *', async () => {
    console.log('💾 Running database backup...');
    // Trigger backup script
    const { exec } = require('child_process');
    exec('node scripts/backup-db.js', (error, stdout, stderr) => {
      if (error) {
        console.error('Backup failed:', error);
      } else {
        console.log('Backup completed:', stdout);
      }
    });
  });

  // Check system health every hour
  cron.schedule('0 * * * *', async () => {
    console.log('🏥 Running health check...');
    await performHealthCheck();
  });

  console.log('✅ All scheduled tasks initialized');
}

// Send reminders for appointments in the next 24 hours
async function sendDailyAppointmentReminders() {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    // Find appointments for tomorrow
    const upcomingAppointments = await Appointment.find({
      preferredDate: {
        $gte: tomorrow,
        $lt: dayAfterTomorrow
      },
      status: 'approved'
    }).populate('userId');

    console.log(`Found ${upcomingAppointments.length} appointments for tomorrow`);

    // Send reminders
    for (const appointment of upcomingAppointments) {
      await sendAppointmentReminder(appointment);
      console.log(`✉️  Reminder sent to ${appointment.userId.email}`);
    }

    console.log('✅ Appointment reminders sent successfully');
  } catch (error) {
    console.error('❌ Error sending appointment reminders:', error);
  }
}

// Clean up old rejected appointments and read messages
async function cleanupOldData() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Delete old rejected appointments
    const deletedAppointments = await Appointment.deleteMany({
      status: 'rejected',
      createdAt: { $lt: thirtyDaysAgo }
    });

    console.log(`🗑️  Deleted ${deletedAppointments.deletedCount} old rejected appointments`);

    // Clean up old read messages (optional - keep for history)
    // const Message = require('../models/Message');
    // await Message.deleteMany({
    //   read: true,
    //   createdAt: { $lt: thirtyDaysAgo }
    // });

    console.log('✅ Data cleanup completed');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Generate daily health statistics report
async function generateDailyReports() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const Triage = require('../models/Triage');

    // Get statistics
    const [
      newPatients,
      newAppointments,
      newTriages,
      highRiskCases
    ] = await Promise.all([
      User.countDocuments({
        role: 'patient',
        createdAt: { $gte: today }
      }),
      Appointment.countDocuments({
        createdAt: { $gte: today }
      }),
      Triage.countDocuments({
        createdAt: { $gte: today }
      }),
      Triage.countDocuments({
        riskLevel: 'high',
        createdAt: { $gte: today },
        doctorResponse: { $exists: false }
      })
    ]);

    const report = {
      date: today.toISOString().split('T')[0],
      statistics: {
        newPatients,
        newAppointments,
        newTriages,
        pendingHighRiskCases: highRiskCases
      }
    };

    console.log('📊 Daily Report:', JSON.stringify(report, null, 2));

    // Optionally save report to database or send to admins
    // await sendReportToAdmins(report);

    console.log('✅ Daily report generated');
  } catch (error) {
    console.error('❌ Error generating report:', error);
  }
}

// Perform system health check
async function performHealthCheck() {
  try {
    const mongoose = require('mongoose');
    
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.error('⚠️  Database connection issue detected');
      // Alert admins or restart service
    }

    // Check memory usage
    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    
    if (heapUsedMB > 500) { // Alert if using more than 500MB
      console.warn(`⚠️  High memory usage: ${heapUsedMB}MB`);
    }

    console.log('✅ Health check completed');
  } catch (error) {
    console.error('❌ Health check failed:', error);
  }
}

module.exports = { initializeCronJobs };