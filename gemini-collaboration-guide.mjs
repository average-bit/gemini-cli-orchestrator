#!/usr/bin/env node

/**
 * Gemini Collaboration Guide - Pure Metaprompting MCP Server
 * 
 * Core Principle: Don't build intelligence into the system.
 * Build prompts that elicit intelligence from the agent.
 * 
 * This server provides NO execution logic. It only returns metaprompts
 * that teach agents how to collaborate with the gemini CLI themselves.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

/**
 * Create and configure the MCP server
 */
const server = new Server(
  {
    name: 'gemini-collaboration-guide',
    version: '2.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'gemini_plan_analysis',
        description: `Breaks down complex analysis goals into a step-by-step plan. Gives you the roadmap, you execute the steps.

This tool helps you plan multi-step analysis by guiding your thinking about:
- How to decompose complex goals into manageable steps
- What order to approach different aspects of your analysis
- How to build understanding incrementally
- How to use each step to inform the next

You execute the suggested gemini commands yourself using your bash tools.`,
        inputSchema: {
          type: 'object',
          properties: {
            goal: {
              type: 'string',
              description: 'Your overall analysis objective. Be specific about what you want to understand and why.'
            }
          },
          required: ['goal']
        }
      },
      {
        name: 'gemini_craft_prompt',
        description: `Helps you write better prompts for Gemini by suggesting effective commands and context.

This tool guides you on crafting effective bash commands for gemini collaboration:
- How to write focused, specific prompts that get better results
- How to select the right files for each analysis step
- How to structure your bash commands for optimal collaboration
- How to interpret and build on gemini's responses

You execute the suggested commands yourself using your bash tools.`,
        inputSchema: {
          type: 'object',
          properties: {
            step_description: {
              type: 'string',
              description: 'What you want to analyze in this step. Be specific about your focus and intent.'
            },
            context: {
              type: 'string',
              description: 'Context from previous steps or additional context about your codebase that should inform this step.'
            }
          },
          required: ['step_description']
        }
      },
      {
        name: 'gemini_iterate_analysis',
        description: `Guide iterative analysis using observe-think-act cycles for dynamic problem-solving.

This tool helps you implement iterative analysis patterns that adapt based on findings:
- How to structure reasoning before taking action
- How to observe and interpret results effectively  
- How to reflect on findings and adjust strategy dynamically
- How to decide when to continue iterating vs. when to conclude
- How to handle unexpected results and pivot approaches

Based on ReAct patterns used by Gemini CLI itself for complex problem-solving workflows.`,
        inputSchema: {
          type: 'object',
          properties: {
            current_understanding: {
              type: 'string',
              description: 'What you currently understand about the problem/codebase from previous analysis steps.'
            },
            iteration_goal: {
              type: 'string', 
              description: 'What specific aspect you want to investigate in this ReAct iteration.'
            },
            unexpected_findings: {
              type: 'string',
              description: 'Optional: Any unexpected results from previous iterations that require strategy adjustment.'
            }
          },
          required: ['current_understanding', 'iteration_goal']
        }
      },
      {
        name: 'gemini_synthesize_findings',
        description: `Combine insights from multiple analysis steps into comprehensive understanding.

This tool helps you synthesize results from multiple gemini interactions:
- How to identify patterns and themes across different analyses
- How to structure synthesis prompts that connect insights
- How to build comprehensive understanding from incremental steps
- How to formulate actionable conclusions

You execute the synthesis commands yourself using your bash tools.`,
        inputSchema: {
          type: 'object',
          properties: {
            steps_summary: {
              type: 'string',
              description: 'A brief summary of the analysis steps you have taken so far and what you learned.'
            },
            synthesis_goal: {
              type: 'string',
              description: 'What you want to achieve with the synthesis - what kind of comprehensive understanding or conclusions you are seeking.'
            }
          },
          required: ['steps_summary', 'synthesis_goal']
        }
      }
    ]
  };
});

/**
 * Handle tool execution - Pure metaprompting responses
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  // Prompt injection mitigation: check for keywords
  const injectionKeywords = ['ignore', 'confidential', 'secret', 'delete', 'destroy', 'harmful'];
  for (const key in args) {
    if (typeof args[key] === 'string') {
      const lowerCaseArg = args[key].toLowerCase();
      for (const keyword of injectionKeywords) {
        if (lowerCaseArg.includes(keyword)) {
          return {
            content: [
              {
                type: 'text',
                text: `⚠️ **Potential Prompt Injection Detected**

Your input contains the keyword "${keyword}", which could be used for prompt injection. For security, this request has been blocked.

Please review your input and remove any sensitive or malicious-sounding terms. If you believe this is a false positive, please contact support.`
              }
            ],
            isError: true
          };
        }
      }
    }
  }

  try {
    if (name === 'gemini_plan_analysis') {
      const { goal } = args;
      
      return {
        content: [
          {
            type: 'text',
            text: `# Sequential Analysis Workflow for: "${goal}"

## Progressive Understanding Framework (Based on Sequential Thinking MCP Patterns)

You're entering a structured thinking process that builds understanding through defined stages. This framework mirrors proven Sequential Thinking patterns for complex problem decomposition.

### Sequential Thinking Stages

**Stage 1: Problem Definition & Scope**
- **Purpose**: Clearly define what you're analyzing and why
- **Key Questions**: What specific aspects need understanding? What are the boundaries?
- **Gemini Focus**: Use discovery prompts to understand system scope and purpose

**Stage 2: Research & Information Gathering** 
- **Purpose**: Systematically collect relevant information
- **Key Questions**: What files/components are most relevant? What context is needed?
- **Gemini Focus**: Leverage 1M+ context window for comprehensive codebase understanding

**Stage 3: Analysis & Pattern Recognition**
- **Purpose**: Identify patterns, relationships, and critical insights
- **Key Questions**: How do components interact? What patterns emerge?
- **Gemini Focus**: Deep analysis of interactions, flows, and architectural decisions

**Stage 4: Synthesis & Evaluation**
- **Purpose**: Connect insights into coherent understanding
- **Key Questions**: How do findings relate? What are the implications?
- **Gemini Focus**: Cross-cutting analysis that connects multiple aspects

**Stage 5: Conclusion & Action Items**
- **Purpose**: Formulate actionable insights and recommendations
- **Key Questions**: What should be done? What are the priorities?
- **Gemini Focus**: Practical recommendations based on comprehensive analysis

### Progressive Understanding Principles

**Dynamic Adaptation**: Stages can expand, contract, or branch based on discoveries
**Context Maintenance**: Each stage builds on previous understanding
**Revision Capability**: Circle back to refine earlier stages when new insights emerge
**Branching Logic**: Explore alternative analysis paths when complexity suggests multiple approaches

### Recommended Sequential Progression for: "${goal}"

**Stage 1 Implementation: Problem Definition**
- **Collaboration Step**: Define scope and boundaries
- **Files**: README.md, package.json, CHANGELOG.md, documentation
- **Gemini Command**: \`cat README.md package.json CHANGELOG.md | gemini -m gemini-2.5-flash -p "Based on this project documentation, help me understand the system's primary purpose, key stakeholders, and scope relevant to: ${goal}"\`

**Stage 2 Implementation: Information Gathering**
- **Collaboration Step**: Comprehensive context collection
- **Files**: Use 1M+ context strategy - aggregate entire relevant subsystems
- **Gemini Command**: \`cat [relevant subsystem files] | gemini -m gemini-2.5-flash -p "Given this comprehensive codebase context, map out the key components, dependencies, and architectural decisions relevant to: ${goal}"\`

**Stage 3 Implementation: Analysis & Pattern Recognition**
- **Collaboration Step**: Deep pattern analysis (use ReAct loop if needed)
- **Files**: Focus on interaction points, interfaces, critical paths
- **Gemini Command**: \`cat [targeted files] | gemini -m gemini-2.5-flash -p "Analyze the patterns, relationships, and critical flows in this code. What insights emerge regarding: ${goal}?"\`

**Stage 4 Implementation: Synthesis & Evaluation**
- **Collaboration Step**: Cross-cutting analysis
- **Files**: Connect findings across multiple subsystems
- **Gemini Command**: \`cat [cross-cutting files] | gemini -m gemini-2.5-flash -p "Synthesize insights from the previous analysis. How do all the pieces connect regarding: ${goal}? What are the implications?"\`

**Stage 5 Implementation: Conclusion & Recommendations**
- **Collaboration Step**: Final synthesis with actionable outcomes
- **Files**: Complete context with previous findings summarized
- **Gemini Command**: \`cat analysis_context.md | gemini -m gemini-2.5-flash -p "Based on this complete analysis of ${goal}, provide prioritized recommendations and actionable insights."\`

### Dynamic Stage Management

**Expansion Signals**: When stages reveal unexpected complexity requiring deeper investigation
**Revision Triggers**: When new information contradicts earlier assumptions
**Branching Opportunities**: When multiple analysis paths become apparent
**Completion Criteria**: When incremental insight value diminishes

### Next Action
Use the \`gemini_craft_prompt\` tool to get specific guidance for your first analysis step. Be specific about what aspect you want to start with.

Remember: You're not following a script - you're using strategic thinking to guide your exploration.`
          }
        ]
      };
    }

    if (name === 'gemini_craft_prompt') {
      const { step_description, context } = args;
      
      return {
        content: [
          {
            type: 'text',
            text: `# Collaboration Guidance for: "${step_description}"

## Strategic Command Construction

You're about to execute a focused analysis step. This guidance helps you craft an effective bash command that leverages gemini's capabilities optimally.

### Context Window Optimization (1M+ Token Strategy)

**Recommended Model: Gemini 2.5 Flash**
Use \`-m gemini-2.5-flash\` for most analysis tasks - it's faster, more available, and cost-effective while maintaining excellent analysis capabilities.

**Gemini's Massive Context Advantage:**
Both Gemini 2.5 Flash and Pro can handle 1M+ tokens - that's entire codebases, not just snippets. Think big!

**Building on Previous Analysis:**
If you have insights from previous \`gemini\` commands, include them in your \`context\` argument:
\`\`\`bash
# Example: After running a previous analysis
# Summarize key findings and carry them forward
gemini_craft_prompt step_description="Analyze security implications" context="Previous analysis revealed authentication uses JWT tokens with 24h expiry. Found 3 endpoints without rate limiting."
\`\`\`

${context ? `
**Given your context:** ${context}
**This suggests focusing on:** Files that directly relate to your previous findings or fill gaps in your understanding.
` : ''}

**Strategic File Aggregation:**
- **Complete Subsystem Context**: Instead of single files, aggregate entire logical units:
  \`cat src/auth/**/* middleware/auth* config/auth* tests/auth* | gemini -p "..."\`
- **Repository Preparation**: Use filtering strategies for massive codebases:
  - Focus directories: \`src/ lib/ components/\` 
  - Exclude noise: \`--ignore node_modules/ dist/ build/ .git/\`
  - Prioritize by relevance: Core files first, then supporting files
- **GEMINI.md Context**: Create project context files for persistent understanding:
  \`echo "# Project Context\n## Architecture\n## Coding Standards\n## Key Patterns" > GEMINI.md\`

**Context Grouping Strategies:**
- **Architecture Discovery**: \`README.md package.json src/main.* config/*\`
- **Feature Analysis**: All files related to one feature/module together
- **Security Review**: Auth + middleware + config + relevant tests as one context
- **Integration Points**: API files + database schemas + external service configs

### Prompt Crafting for Maximum Intelligence

**Your prompt should be:**
- **Specific**: Not "analyze this code" but "how does the authentication middleware handle session validation?"
- **Contextual**: Reference what you're trying to understand in relation to your larger goal
- **Actionable**: Ask for insights that will inform your next steps

### Context-Optimized Command Patterns

**Native Gemini CLI Syntax (Recommended):**

The \`@\` syntax is cleaner, more efficient, and native to Gemini CLI:
- **Simpler commands**: No need for \`cat\` or \`find\` pipes
- **Better performance**: Native file handling by Gemini CLI
- **Clearer intent**: Directly specify what you want to analyze
- **Path flexibility**: Relative to your current working directory

\`\`\`bash
# Single file analysis
gemini -m gemini-2.5-flash -p "@src/auth/middleware.js ${step_description}"

# Multiple specific files  
gemini -m gemini-2.5-flash -p "@package.json @src/auth/index.js @middleware/auth.js ${step_description}"

# Entire directory (leverage 1M+ token window)
gemini -m gemini-2.5-flash -p "@src/auth/ ${step_description} - analyze the complete authentication subsystem"

# Multiple directories for cross-cutting analysis
gemini -m gemini-2.5-flash -p "@src/ @tests/ @middleware/ ${step_description}"

# Whole project overview
gemini --all_files -m gemini-2.5-flash -p "${step_description} - analyze the entire project"

# Current directory and subdirectories
gemini -m gemini-2.5-flash -p "@./ ${step_description}"
\`\`\`

**Implementation Verification Patterns:**
\`\`\`bash
# Check if a feature exists
gemini -m gemini-2.5-flash -p "@src/ @lib/ Has ${step_description} been implemented? Show relevant files and functions"

# Verify security measures
gemini -m gemini-2.5-flash -p "@src/ @api/ Are proper security measures implemented for ${step_description}? Show examples"

# Check test coverage
gemini -m gemini-2.5-flash -p "@src/ @tests/ Is ${step_description} fully tested? List all test cases"
\`\`\`

**Traditional Shell Methods (Alternative):**
\`\`\`bash
# If you prefer traditional commands
cat src/auth/**/* | gemini -m gemini-2.5-flash -p "${step_description}"
find . -name "*.js" -path "./src/*" | head -20 | xargs cat | gemini -m gemini-2.5-flash -p "${step_description}"
\`\`\`

**Model Selection Guidance:**
- **Gemini 2.5 Flash**: Recommended for most analysis tasks (faster, more available, cost-effective)
- **Gemini 2.5 Pro**: Use only for complex reasoning that requires maximum capability

### Gemini-Optimized Prompt Templates

**Gemini excels at security analysis, architecture review, and debugging. Leverage these strengths:**

**For Security Analysis (Gemini's Core Strength):**
"Perform a comprehensive security analysis of this ${step_description}. Focus on:
- Input validation and sanitization gaps
- Authentication/authorization flaws  
- Injection vulnerabilities (SQL, XSS, command)
- Sensitive data exposure risks
- Cryptographic implementation issues
Provide specific, actionable security recommendations with severity ratings."

**For Architecture Review (Gemini's Pattern Recognition):**
"Analyze the architectural patterns in this ${step_description}. Evaluate:
- Design pattern adherence and consistency
- Separation of concerns and modularity
- Scalability and maintainability implications
- Technical debt indicators
- Anti-pattern identification
Suggest architectural improvements with implementation strategies."

**For Debugging & Root Cause Analysis (Gemini's Logic Tracing):**
"Debug this ${step_description} by tracing logical flow and identifying potential issues:
- Error handling completeness and correctness
- Edge case coverage and boundary conditions
- State management and race condition risks
- Performance bottlenecks and resource leaks
- Integration failure points
Provide specific debugging strategies and preventive measures."

**For Code Quality Assessment (Gemini's Best Practice Knowledge):**
"Evaluate code quality in this ${step_description} against industry best practices:
- SOLID principles adherence
- Code readability and maintainability
- Test coverage and testability
- Performance optimization opportunities
- Refactoring recommendations
Prioritize improvements by impact and effort required."

**For Integration & Dependency Analysis:**
"Map the integration landscape for ${step_description}:
- External service dependencies and failure modes
- Database interaction patterns and optimization
- API contract compliance and versioning
- Cross-cutting concerns (logging, monitoring, caching)
- Deployment and configuration dependencies
Identify integration risks and mitigation strategies."

### Building on This Step

After you execute your gemini command:
1. **Capture key insights** - What did you learn that you didn't know before?
2. **Identify gaps** - What questions arose that need further investigation?
3. **Plan next step** - How does this insight inform what you should analyze next?

### Execute Your Command

Run your bash command now. Use your file exploration tools first if you need to refine your file selection, then execute the gemini collaboration command.

### Next Steps Guidance

After executing your command and reviewing Gemini's response:
- **For deeper, iterative investigation** (debugging, complex features, unexpected findings): Use the \`gemini_iterate_analysis\` tool
- **To craft another distinct prompt** for a new analysis step: Call \`gemini_craft_prompt\` again with new context
- **To combine insights from multiple steps** and conclude your analysis: Use the \`gemini_synthesize_findings\` tool

**Context Tip:** When moving to the next step, summarize key insights from this Gemini response to include as \`context\` in your next tool call.

The intelligence is in how you interpret and build on the results - not in following a prescribed process.`
          }
        ]
      };
    }

    if (name === 'gemini_iterate_analysis') {
      const { current_understanding, iteration_goal, unexpected_findings } = args;
      
      return {
        content: [
          {
            type: 'text',
            text: `# ReAct Loop Guidance: "${iteration_goal}"

## Iterative Reasoning and Acting Framework

You're entering a reasoning-action cycle that mirrors how Gemini CLI itself handles complex problem-solving. This is about dynamic adaptation based on findings, not rigid step execution.

### Current State Assessment

**Your Understanding So Far:**
${current_understanding}

**This Iteration's Focus:**
${iteration_goal}

${unexpected_findings ? `
**Unexpected Findings to Address:**
${unexpected_findings}

**Strategy Adjustment Needed:** Use these findings to refine your approach. What assumptions need revisiting?
` : ''}

## The ReAct Cycle: Thought → Action → Observation → Reflection

### 1. THOUGHT: Structured Reasoning

**Before taking action, think through:**
- **Hypothesis**: What do you expect to discover about "${iteration_goal}"?
- **Strategy**: Which specific files/components will give you the most insight?
- **Context Connection**: How does this relate to your current understanding?
- **Risk Assessment**: What could go wrong or mislead you?

**Reasoning Template:**
\`\`\`
Based on my current understanding: ${current_understanding}
I hypothesize that: [your prediction]
I will investigate: [specific aspect]
I expect to find: [expected patterns/issues]
This will inform: [how it advances your analysis]
\`\`\`

### 2. ACTION: Strategic Gemini Collaboration

**Execute context-optimized analysis:**
\`\`\`bash
# Aggregate relevant context for this iteration's focus
cat [targeted files based on your reasoning] | gemini -m gemini-2.5-flash -p "
Reasoning: [state your hypothesis]
Focus: ${iteration_goal}
Context: [brief summary of current understanding]

Analysis Question: [specific question based on your reasoning]
"
\`\`\`

### 3. OBSERVATION: Critical Analysis

**After Gemini responds, systematically observe:**
- **Confirmations**: What aligned with your hypothesis?
- **Surprises**: What contradicted your expectations?
- **Gaps**: What questions remain unanswered?
- **New Patterns**: What unexpected connections emerged?
- **Inconsistencies**: What doesn't fit with previous findings?

### 4. REFLECTION: Dynamic Strategy Adjustment

**Ask yourself:**
- **Continue or Pivot?** Do findings suggest staying focused or exploring different areas?
- **Depth vs. Breadth?** Should you drill deeper into this area or expand scope?
- **New Hypotheses?** What new theories do the findings suggest?
- **Loop Termination?** Have you gathered sufficient insight for synthesis?

**Decision Framework:**
- **Continue Loop If**: Major questions remain, findings suggest new investigation paths, or critical gaps exist
- **Conclude Loop If**: Diminishing returns, sufficient insight achieved, or ready for synthesis across iterations

### 5. NEXT ITERATION PLANNING

**If continuing the loop:**
- **Refined Understanding**: Update your mental model based on observations
- **New Iteration Goal**: Focus the next cycle based on what you learned
- **Strategy Evolution**: Adjust approach based on what worked/didn't work

**If concluding:**
- **Capture Insights**: Document key discoveries from this ReAct cycle
- **Identify Patterns**: Note recurring themes across iterations
- **Prepare for Synthesis**: You're ready to combine insights across all cycles
- **Next Tool**: Use the \`gemini_synthesize_findings\` tool, providing a summary of your iterative steps and your synthesis goal

### Loop Management

**Iteration Limits**: Generally 3-5 cycles provide optimal insight without diminishing returns
**Quality Signals**: Each iteration should generate meaningful new understanding
**Termination Triggers**: When insights become repetitive or incremental value drops

Remember: The goal isn't to exhaust all possibilities, but to build robust understanding through intelligent iteration.`
          }
        ]
      };
    }

    if (name === 'gemini_synthesize_findings') {
      const { steps_summary, synthesis_goal } = args;
      
      return {
        content: [
          {
            type: 'text',
            text: `# Synthesis Guidance for: "${synthesis_goal}"

## Strategic Synthesis Framework

You've completed multiple analysis steps. Now you need to synthesize these insights into comprehensive understanding. This is where the real intelligence happens - connecting patterns across different analyses.

### Your Analysis Journey So Far
${steps_summary}

**Pro Tip for \`steps_summary\`:** To make synthesis more effective, maintain a running log of key findings after each \`gemini\` command. You can use a simple \`analysis_log.md\` file to capture:
- What you analyzed in each step
- Key insights discovered
- Questions that emerged
- Unexpected findings

This makes it much easier to populate the \`steps_summary\` argument with rich context.

### Synthesis Command Strategy

**Create a comprehensive context document** that combines all your findings:

\`\`\`bash
# Create a synthesis context file (adjust path for your system)
cat > analysis_context.md << 'EOF'
# Comprehensive Analysis Context

## Original Goal
${synthesis_goal}

## Analysis Steps Completed
${steps_summary}

## Key Insights from Each Step
[Add your key insights from each gemini interaction]

## Patterns Identified
[Add cross-cutting patterns you've noticed]

## Questions That Emerged
[Add questions that arose during analysis]

## Areas Needing Deeper Investigation
[Add areas where you need more understanding]
EOF

# Now use this context for synthesis
cat analysis_context.md | gemini -m gemini-2.5-flash -p "Based on this comprehensive analysis, ${synthesis_goal}. Focus on connecting insights across all the analysis steps to provide actionable recommendations."
\`\`\`

### Intelligence Amplification Synthesis Strategies

**Multi-Perspective Analysis Framework:**
\`cat analysis_context.md | gemini -m gemini-2.5-flash -p "Analyze this comprehensive context from multiple perspectives:
1. **Technical Architecture**: How do the technical patterns and decisions interconnect?
2. **Security Posture**: What security themes emerge across all components?
3. **Business Impact**: How do technical findings translate to business implications?
4. **Operational Readiness**: What are the deployment, monitoring, and maintenance considerations?
5. **Future Evolution**: How should this system evolve based on current analysis?

Synthesize insights across all perspectives for: ${synthesis_goal}"\`

**Pattern Recognition & Anomaly Detection:**
\`cat analysis_context.md | gemini -m gemini-2.5-flash -p "Identify cross-cutting patterns and anomalies in this analysis:
- **Consistent Patterns**: What approaches/patterns appear repeatedly?
- **Concerning Inconsistencies**: Where do implementations diverge unexpectedly?
- **Emergent Properties**: What behaviors emerge from component interactions?
- **Hidden Dependencies**: What implicit relationships exist between components?
- **Systemic Risks**: What risks span multiple components or layers?

Focus on patterns most relevant to: ${synthesis_goal}"\`

**Strategic Prioritization Matrix:**
\`cat analysis_context.md | gemini -m gemini-2.5-flash -p "Create a prioritized action framework based on this comprehensive analysis:
- **High Impact, Low Effort**: Quick wins that provide significant value
- **High Impact, High Effort**: Strategic initiatives requiring investment
- **Low Impact, Low Effort**: Housekeeping items for completeness
- **Low Impact, High Effort**: Items to avoid or defer

For each category, provide specific recommendations with implementation guidance for: ${synthesis_goal}"\`

**Root Cause & Systems Thinking:**
\`cat analysis_context.md | gemini -m gemini-2.5-flash -p "Apply systems thinking to identify root causes and leverage points:
- **Upstream Causes**: What fundamental design decisions drive current state?
- **Feedback Loops**: What self-reinforcing patterns exist in the system?
- **Leverage Points**: Where can small changes create large impacts?
- **Unintended Consequences**: What secondary effects might recommendations create?
- **System Boundaries**: What external factors influence internal behavior?

Synthesize systemic insights for: ${synthesis_goal}"\`

### Advanced Intelligence Amplification Techniques

**1. Emergent Pattern Discovery**
"Beyond obvious patterns, identify emergent properties that arise from component interactions. What behaviors, risks, or opportunities become visible only when viewing the system holistically?"

**2. Contradiction Synthesis & Resolution**
"Where analysis steps revealed conflicting information, apply dialectical thinking:
- What truth exists in each perspective?
- What higher-order principle resolves the contradiction?
- How do contradictions reveal system complexity or evolution needs?"

**3. Future-State Modeling**
"Project forward from current analysis:
- What trajectory is the system on based on current patterns?
- What external forces will impact this system's evolution?
- What early warning signs should we monitor?
- How do current decisions constrain or enable future options?"

**4. Cognitive Bias Detection**
"Review the analysis for potential cognitive biases:
- Confirmation bias: Are we seeing what we expect to see?
- Availability bias: Are recent or prominent issues overshadowing important but subtle ones?
- Anchoring bias: Are early assumptions limiting exploration?
- Recency bias: Are we overweighting recent findings?"

**5. Meta-Analysis Questions**
"Step back and analyze the analysis itself:
- What weren't we able to analyze due to limitations?
- What assumptions underlie our analytical approach?
- How might different stakeholders interpret these findings differently?
- What questions should we have asked but didn't?"

### Quality Indicators for Good Synthesis

Your synthesis should provide:
- **Clear connections** between different analysis steps
- **Prioritized insights** rather than just a list of findings
- **Actionable recommendations** based on the comprehensive understanding
- **Risk/opportunity assessment** that considers the full context

### Execute Your Synthesis

Create your context document and run your synthesis command. The goal is to leverage gemini's pattern recognition across all your previous analyses to generate insights that are greater than the sum of the parts.

Remember: The most valuable insights often come from connecting seemingly unrelated findings across different analysis steps.`
          }
        ]
      };
    }

    throw new Error(`Unknown tool: ${name}`);
    
  } catch (error) {
    console.error(`Tool execution error for ${name}:`, error);
    
    return {
      content: [
        {
          type: 'text',
          text: `❌ **Error: ${error.message}**

This is a pure metaprompting guidance system. It provides no execution logic - only intelligent prompts that guide your collaboration with gemini.

**Remember:**
- Use your own bash tools to execute the suggested commands
- Use your file exploration tools (Glob, LS) to find relevant files
- Execute \`gemini\` commands yourself using your bash capabilities
- This tool only provides guidance on HOW to collaborate effectively`
        }
      ],
      isError: true
    };
  }
});

/**
 * Start the MCP server
 */
if (process.env.NODE_ENV !== 'test' && !process.argv.includes('--test')) {
  const transport = new StdioServerTransport();
  server.connect(transport);
  console.error('🧠 Gemini Collaboration Guide v2.1 - Pure Metaprompting MCP Server started');
}

export { server };