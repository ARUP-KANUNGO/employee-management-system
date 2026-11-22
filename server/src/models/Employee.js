import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
      match: [/^[\d\s+\-()]{0,20}$/, 'Please provide a valid phone number'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      enum: {
        values: [
          'Engineering', 'Product', 'Design', 'Marketing', 'Sales',
          'Human Resources', 'Finance', 'Operations', 'Customer Support',
        ],
        message: 'Invalid department',
      },
      index: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
      maxlength: [100, 'Designation cannot exceed 100 characters'],
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [0, 'Salary cannot be negative'],
    },
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required'],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['active', 'inactive', 'on-leave', 'terminated'],
        message: 'Invalid status',
      },
      default: 'active',
      index: true,
    },
    profileImage: {
      type: String,
      trim: true,
      default: '',
      match: [/^https?:\/\/.+/, 'Profile image must be a valid URL'],
    },
    linkedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true },
)

// Text index for search across name, email, employeeId
employeeSchema.index({ name: 'text', email: 'text', employeeId: 'text' })

// Virtual for serializing without __v
employeeSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret.__v
    return ret
  },
})

export default mongoose.model('Employee', employeeSchema)
