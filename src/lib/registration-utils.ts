/**
 * Registration Number Validation and Department Detection Utilities
 * Format: UG20/COMS/1168
 */

export interface DepartmentInfo {
  code: string;
  name: string;
  faculty: string;
}

export const DEPARTMENTS: Record<string, DepartmentInfo> = {
  COMS: {
    code: 'COMS',
    name: 'Computer Science',
    faculty: 'Faculty of Computing'
  },
  ICT: {
    code: 'ICT',
    name: 'Information Communication Technology',
    faculty: 'Faculty of Computing'
  },
  BIOL: {
    code: 'BIOL',
    name: 'Biology',
    faculty: 'Faculty of Life Sciences'
  },
  BIOC: {
    code: 'BIOC',
    name: 'Biochemistry',
    faculty: 'Faculty of Life Sciences'
  },
  CHEM: {
    code: 'CHEM',
    name: 'Chemistry',
    faculty: 'Faculty of Physical Sciences'
  },
  MTH: {
    code: 'MTH',
    name: 'Mathematics',
    faculty: 'Faculty of Physical Sciences'
  },
  SLT: {
    code: 'SLT',
    name: 'Science Laboratory Technology',
    faculty: 'Faculty of Applied Sciences'
  },
  CVIL: {
    code: 'CVIL',
    name: 'Civil Engineering',
    faculty: 'Faculty of Engineering'
  },
  MECH: {
    code: 'MECH',
    name: 'Mechanical Engineering',
    faculty: 'Faculty of Engineering'
  },
  ELEC: {
    code: 'ELEC',
    name: 'Electrical Engineering',
    faculty: 'Faculty of Engineering'
  },
  AGRI: {
    code: 'AGRI',
    name: 'Agriculture',
    faculty: 'Faculty of Agriculture'
  },
  ECON: {
    code: 'ECON',
    name: 'Economics',
    faculty: 'Faculty of Social Sciences'
  },
  ACCT: {
    code: 'ACCT',
    name: 'Accounting',
    faculty: 'Faculty of Management Sciences'
  },
  BUSI: {
    code: 'BUSI',
    name: 'Business Administration',
    faculty: 'Faculty of Management Sciences'
  },
  ENGL: {
    code: 'ENGL',
    name: 'English Language',
    faculty: 'Faculty of Humanities'
  },
  HIST: {
    code: 'HIST',
    name: 'History',
    faculty: 'Faculty of Humanities'
  },
  POLS: {
    code: 'POLS',
    name: 'Political Science',
    faculty: 'Faculty of Social Sciences'
  },
  SOCW: {
    code: 'SOCW',
    name: 'Social Work',
    faculty: 'Faculty of Social Sciences'
  }
};

/**
 * Validates registration number format
 * Expected format: UG20/COMS/1168
 */
export function validateRegistrationNumber(regNo: string): {
  isValid: boolean;
  error?: string;
  parts?: {
    level: string;
    year: string;
    department: string;
    studentNumber: string;
  };
} {
  if (!regNo || typeof regNo !== 'string') {
    return {
      isValid: false,
      error: 'Registration number is required'
    };
  }

  // Remove extra spaces and convert to uppercase
  const cleanRegNo = regNo.trim().toUpperCase();

  // Check basic format: UG20/DEPT/1168
  const regNoPattern = /^([A-Z]{2})(\d{2})\/([A-Z]{3,4})\/(\d{3,5})$/;
  const match = cleanRegNo.match(regNoPattern);

  if (!match) {
    return {
      isValid: false,
      error: 'Invalid format. Use format: UG20/COMS/1168'
    };
  }

  const [, level, year, department, studentNumber] = match;

  // Validate level (UG for Undergraduate, PG for Postgraduate, etc.)
  const validLevels = ['UG', 'PG', 'ND', 'HND'];
  if (!validLevels.includes(level)) {
    return {
      isValid: false,
      error: 'Invalid level. Use UG, PG, ND, or HND'
    };
  }

  // Validate year (should be reasonable year)
  const yearNum = parseInt(year);
  const currentYear = new Date().getFullYear() % 100; // Get last 2 digits
  if (yearNum < 10 || yearNum > currentYear + 5) {
    return {
      isValid: false,
      error: 'Invalid year in registration number'
    };
  }

  // Validate department code
  if (!DEPARTMENTS[department]) {
    return {
      isValid: false,
      error: `Unknown department code: ${department}`
    };
  }

  // Validate student number (should be 3-5 digits)
  const studentNum = parseInt(studentNumber);
  if (isNaN(studentNum) || studentNum < 1 || studentNum > 99999) {
    return {
      isValid: false,
      error: 'Invalid student number'
    };
  }

  return {
    isValid: true,
    parts: {
      level,
      year,
      department,
      studentNumber
    }
  };
}

/**
 * Get department information from registration number
 */
export function getDepartmentFromRegNo(regNo: string): DepartmentInfo | null {
  const validation = validateRegistrationNumber(regNo);

  if (!validation.isValid || !validation.parts) {
    return null;
  }

  return DEPARTMENTS[validation.parts.department] || null;
}

/**
 * Format registration number consistently
 */
export function formatRegistrationNumber(regNo: string): string {
  const validation = validateRegistrationNumber(regNo);

  if (!validation.isValid || !validation.parts) {
    return regNo;
  }

  const { level, year, department, studentNumber } = validation.parts;
  return `${level}${year}/${department}/${studentNumber.padStart(4, '0')}`;
}

/**
 * Get student year from registration number
 */
export function getStudentYear(regNo: string): number | null {
  const validation = validateRegistrationNumber(regNo);

  if (!validation.isValid || !validation.parts) {
    return null;
  }

  const entryYear = parseInt(`20${validation.parts.year}`);
  const currentYear = new Date().getFullYear();
  return currentYear - entryYear + 1;
}

/**
 * Check if registration number belongs to a specific department
 */
export function isDepartmentMember(regNo: string, departmentCode: string): boolean {
  const validation = validateRegistrationNumber(regNo);

  if (!validation.isValid || !validation.parts) {
    return false;
  }

  return validation.parts.department === departmentCode.toUpperCase();
}

/**
 * Get all departments as options for select inputs
 */
export function getDepartmentOptions(): Array<{ value: string; label: string; faculty: string }> {
  return Object.values(DEPARTMENTS).map(dept => ({
    value: dept.code,
    label: `${dept.name} (${dept.code})`,
    faculty: dept.faculty
  }));
}

/**
 * Search departments by name or code
 */
export function searchDepartments(query: string): DepartmentInfo[] {
  const searchTerm = query.toLowerCase();

  return Object.values(DEPARTMENTS).filter(dept =>
    dept.name.toLowerCase().includes(searchTerm) ||
    dept.code.toLowerCase().includes(searchTerm) ||
    dept.faculty.toLowerCase().includes(searchTerm)
  );
}